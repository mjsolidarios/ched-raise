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

// Set JSON response headers for non-PDF responses
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

// Check if this is a PDF generation request
$type = $input['type'] ?? null;

if ($type === 'generate_certificate') {
    $certType = $input['certificateType'] ?? null;
    $name = $input['name'] ?? null;
    $middleName = $input['middleName'] ?? '';
    $lastName = $input['lastName'] ?? '';

    // Construct full name
    $fullNameParts = array_filter([$name, $middleName, $lastName]);
    $fullName = implode(' ', $fullNameParts);
    if (empty($fullName)) {
        $fullName = "Participant";
    }

    if (!$certType) {
        respondJson(400, ['error' => 'Missing certificate type.']);
    }

    // Create PDF
    $pdf = new FPDF('L', 'mm', 'A4'); // Landscape
    $pdf->AddPage();
    
    // Add Border
    $pdf->SetLineWidth(2);
    $pdf->Rect(10, 10, 277, 190);
    
    // Basic Branding
    $pdf->SetFont('Arial', 'B', 24);
    $pdf->SetXY(0, 40);
    $pdf->Cell(297, 10, 'CHED RAISE', 0, 1, 'C');
    
    $pdf->SetFont('Arial', '', 14);
    $pdf->Cell(297, 10, 'Technical Assistance and Monitoring', 0, 1, 'C');
    
    $pdf->Ln(20);
    
    if ($certType === 'appearance') {
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Cell(297, 15, 'CERTIFICATE OF APPEARANCE', 0, 1, 'C');
        
        $pdf->Ln(20);
        
        $pdf->SetFont('Arial', '', 16);
        $pdf->Cell(297, 10, 'This is to certify that', 0, 1, 'C');
        
        $pdf->Ln(10);
        
        $pdf->SetFont('Times', 'B', 32);
        $pdf->Cell(297, 15, strtoupper($fullName), 0, 1, 'C');
        // Underline effect
        $pdf->Line(70, $pdf->GetY(), 227, $pdf->GetY());
        
        $pdf->Ln(20);
        
        $pdf->SetFont('Arial', '', 16);
        $purpose = "has personally appeared to facilitate the Technical Assistance.";
        $pdf->SetXY(48, $pdf->GetY());
        $pdf->MultiCell(200, 10, $purpose, 0, 'C');

    } elseif ($certType === 'participation') {
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Cell(297, 15, 'CERTIFICATE OF PARTICIPATION', 0, 1, 'C');
        
        $pdf->Ln(20);
        
        $pdf->SetFont('Arial', '', 16);
        $pdf->Cell(297, 10, 'This is to certify that', 0, 1, 'C');
        
        $pdf->Ln(10);
        
        $pdf->SetFont('Times', 'B', 32);
        $pdf->Cell(297, 15, strtoupper($fullName), 0, 1, 'C');
        // Underline effect
        $pdf->Line(70, $pdf->GetY(), 227, $pdf->GetY());
        
        $pdf->Ln(20);
        
        $pdf->SetFont('Arial', '', 16);
        $text = "has actively participated in the CHED RAISE Program activities.";
        $pdf->SetXY(48, $pdf->GetY());
        $pdf->MultiCell(200, 10, $text, 0, 'C');
    }

    $pdf->Ln(20);
    
    $pdf->SetFont('Arial', '', 12);
    $dateStr = "Given this " . date('jS') . " day of " . date('F, Y') . ".";
    $pdf->Cell(297, 10, $dateStr, 0, 1, 'C');

    // Output PDF
    // Clear any previous output
    if (ob_get_length()) ob_clean();
    
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="certificate.pdf"');
    $pdf->Output('D', 'ched-raise-certificate.pdf');
    exit;
}

// Validate input for email sending
$from = $input['from'] ?? null;
$to = $input['to'] ?? null;
$ticketCode = $input['ticketCode'] ?? null;
$name = $input['firstName'] ?? $input['name'] ?? 'User';
$middleName = $input['middleName'] ?? null;
$lastName = $input['lastName'] ?? null;
$certificateType = $input['certificateType'] ?? null;

// Determine API URL for certificate generation
// This assumes the API is reachable publicly or locally where the user clicks the link
$apiUrl = $_ENV['API_BASE_URL'] ?? 'http://localhost/api/email'; // Fallback needs to be adjusted by user

if (!$from || !$to || !$type || !$ticketCode) {
    respondJson(400, ['error' => 'Missing required fields: from, to, type, ticketCode']);
}

// Determine template content
$htmlContent = '';
$subject = '';

switch ($type) {
    case 'registration_confirmation':
        $templatePath = __DIR__ . '/templates/RegistrationEmail.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Registration Confirmation';
            $htmlContent = str_replace('{{ticketCode}}', $ticketCode, $htmlContent);
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'registration_rejected':
        $templatePath = __DIR__ . '/templates/RegistrationRejectedEmail.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Registration Rejected';
            $htmlContent = str_replace('{{ticketCode}}', $ticketCode, $htmlContent);
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'registration_approved':
        $templatePath = __DIR__ . '/templates/RegistrationApprovedEmail.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Registration Approved';
            $htmlContent = str_replace('{{ticketCode}}', $ticketCode, $htmlContent);
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'participation_certificate':
        $templatePath = __DIR__ . '/certificates/ParticipationCertificate.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Participation Certificate';
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
            $htmlContent = str_replace('{{middleName}}', $middleName, $htmlContent);
            $htmlContent = str_replace('{{lastName}}', $lastName, $htmlContent);
            $htmlContent = str_replace('{{apiUrl}}', $apiUrl, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'appearance_certificate':
        $templatePath = __DIR__ . '/certificates/AppearanceCertificate.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = 'Appearance Certificate';
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
            $htmlContent = str_replace('{{middleName}}', $middleName, $htmlContent);
            $htmlContent = str_replace('{{lastName}}', $lastName, $htmlContent);
            $htmlContent = str_replace('{{certificateType}}', $certificateType, $htmlContent);
            $htmlContent = str_replace('{{apiUrl}}', $apiUrl, $htmlContent);
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
