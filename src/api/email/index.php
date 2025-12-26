<?php

require __DIR__ . '/vendor/autoload.php';

use Resend\Resend;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// Use safeLoad to avoid exception if .env is missing
$dotenv->safeLoad();

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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$from = $input['from'] ?? null;
$to = $input['to'] ?? null;
$type = $input['type'] ?? null;
$ticketCode = $input['ticketCode'] ?? null;

if (!$from || !$to || !$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: from, to, type']);
    exit;
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
            http_response_code(500);
            echo json_encode(['error' => 'Template file not found.']);
            exit;
        }
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => "Unknown email type: $type"]);
        exit;
}

// Get API Key from environment variables (checking generic name or VITE prefixed one as fallback)
$apiKey = $_ENV['RESEND_API_KEY'] ?? $_ENV['VITE_RESEND_API_KEY'] ?? getenv('RESEND_API_KEY');

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Resend API Key is not configured.']);
    exit;
}

// Send email
try {
    $resend = Resend::client($apiKey);

    $result = $resend->emails->send([
        'from' => $from,
        'to' => $to,
        'subject' => $subject,
        'html' => $htmlContent,
    ]);

    echo json_encode(['success' => true, 'id' => $result->id]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email: ' . $e->getMessage()]);
}
