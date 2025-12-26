<?php

function respondJson(int $statusCode, array $payload): void {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Set JSON response headers
header('Content-Type: application/json');

// Check request method
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';
if ($requestMethod !== 'POST') {
    respondJson(405, [
        'error' => 'Method not allowed. Use POST.',
        'method' => $requestMethod,
        'uri' => $_SERVER['REQUEST_URI'] ?? null,
    ]);
}

$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    respondJson(500, [
        'error' => 'Server dependencies are missing. Please deploy the vendor/ directory or run composer install.',
    ]);
}

require $autoloadPath;

// Load environment variables
if (class_exists(Dotenv\Dotenv::class)) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    // Use safeLoad to avoid exception if .env is missing
    $dotenv->safeLoad();
}

// Get input
$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody ?: '', true);

// Fallback to $_POST if JSON is invalid or not an array
if (!is_array($input)) {
    if (!empty($_POST)) {
        $input = $_POST;
    } else {
        respondJson(400, [
            'error' => 'Invalid JSON request body or empty POST data.',
            'jsonError' => json_last_error_msg(),
        ]);
    }
}

// Validate input
$from = $input['from'] ?? null;
$to = $input['to'] ?? null;
$type = $input['type'] ?? null;
$ticketCode = $input['ticketCode'] ?? null;

if (!$from || !$to || !$type || !$ticketCode) {
    respondJson(400, ['error' => 'Missing required fields: from, to, type, ticketCode']);
}

// Determine template content
$htmlContent = '';
$subject = '';

switch ($type) {
    case 'registration_confirmation':
        $templatePath = __DIR__ . '/RegistrationEmail.php';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Registration Confirmation';
            $htmlContent = str_replace('{{ticketCode}}', $ticketCode, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    default:
        respondJson(400, ['error' => "Unknown email type: $type"]);
}

// Get API Key from environment variables (checking generic name or VITE prefixed one as fallback)
$apiKey = $_ENV['RESEND_API_KEY'] ?? $_ENV['VITE_RESEND_API_KEY'] ?? getenv('RESEND_API_KEY');

if (!$apiKey) {
    respondJson(500, ['error' => 'Resend API Key is not configured.']);
}

$configuredFrom = $_ENV['RESEND_FROM'] ?? $_ENV['EMAIL_FROM'] ?? getenv('RESEND_FROM') ?? getenv('EMAIL_FROM');
$fromToUse = $configuredFrom ?: $from;

// Send email
try {
    $resend = \Resend::client($apiKey);

    $result = $resend->emails->send([
        'from' => $fromToUse,
        'to' => $to,
        'subject' => $subject,
        'html' => $htmlContent,
    ]);

    respondJson(200, ['success' => true, 'id' => $result->id]);

} catch (\Throwable $e) {
    $statusCode = 500;
    $details = null;

    if ($e instanceof \GuzzleHttp\Exception\RequestException && $e->hasResponse()) {
        $response = $e->getResponse();
        $statusCode = (int) $response->getStatusCode();
        $body = (string) $response->getBody();
        $decoded = json_decode($body, true);
        $details = is_array($decoded) ? $decoded : $body;
    }

    respondJson($statusCode, [
        'error' => 'Failed to send email.',
        'message' => $e->getMessage(),
        'fromUsed' => $fromToUse,
        'details' => $details,
    ]);
}
