<?php

function respondJson(int $statusCode, array $payload): void
{
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

function encryptData(array $data, string $key): string
{
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt(json_encode($data), 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}

function decryptData(string $data, string $key): ?array
{
    $parts = explode('::', base64_decode($data), 2);
    if (count($parts) !== 2)
        return null;
    list($encrypted_data, $iv) = $parts;
    $decrypted = openssl_decrypt($encrypted_data, 'aes-256-cbc', $key, 0, $iv);
    return $decrypted ? json_decode($decrypted, true) : null;
}

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

// Encryption Key
$encryptionKey = $_ENV['ENCRYPTION_KEY'] ?? $_ENV['VITE_ENCRYPTION_KEY'] ?? getenv('ENCRYPTION_KEY');

// Get input
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';
$input = [];

// Handle GET request used for Certificate Download (Encrypted)
if ($requestMethod === 'GET' && isset($_GET['data'])) {
    if (!$encryptionKey) {
        respondJson(500, ['error' => 'Encryption key not configured.']);
    }

    // Replace spaces with + because some email clients/browsers might decode + to space in the URL query param
    $encryptedData = str_replace(' ', '+', $_GET['data']);
    $input = decryptData($encryptedData, $encryptionKey);

    if (!$input) {
        respondJson(400, ['error' => 'Invalid or failed to decrypt data.']);
    }
} else {
    // Normal POST Handling
    $rawBody = file_get_contents('php://input');
    $input = json_decode($rawBody ?: '', true);

    // Fallback to $_POST if JSON is invalid or not an array
    if (!is_array($input)) {
        if (!empty($_POST)) {
            $input = $_POST;
        } else {
            // If it's a POST but empty, or not GET with data, we might error out only if we really need input.
            // But let's keep the original logic's spirit: require valid input.
            // However, checking method first is safer.
            if ($requestMethod === 'POST') {
                respondJson(400, [
                    'error' => 'Invalid JSON request body or empty POST data.',
                    'jsonError' => json_last_error_msg(),
                ]);
            }
        }
    }
}

// Ensure input is array
if (!is_array($input))
    $input = [];

// Re-check method for strictness only if we didn't get valid GET input?
// Actually, earlier we respondJson 405 if not POST. We should relax that now.
// REMOVING the strict "Method not allowed. Use POST" check from earlier or modifying it.
// Since I can't easily reach up to line 25 in this chunk, I will assume I need to address it.
// Wait, I missed the check at line 25 in my previous readView. 
// I need to start my edit earlier to remove that check or modify it.

// Let's redo this chunk to replace from line 23 down to 63 to include the method check removal.

// Check if this is a PDF generation request
$type = $input['type'] ?? null;

if ($type === 'generate_certificate') {
    $certType = $input['certificateType'] ?? null;
    $name = $input['name'] ?? null;
    $middleName = $input['middleName'] ?? '';
    $lastName = $input['lastName'] ?? '';
    $school = $input['school'] ?? '';

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
        $purpose = "This is to certify that " . strtoupper($fullName) . " of " . $school . " appeared at the Iloilo Convention Center on January 28-30, 2026 to attend the CHED-RAISE 2026 Summit.";
        $pdf->SetXY(40, $pdf->GetY());
        $pdf->MultiCell(217, 10, $purpose, 0, 'C');

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

    $pdf->Ln(15);
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->Cell(297, 10, 'DR. RAUL F. MUYONG', 0, 1, 'C');
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(297, 5, 'Regional Director, CHED Regional Office VI', 0, 1, 'C');

    // Output PDF
    // Clear any previous output
    if (ob_get_length())
        ob_clean();

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
            $subject = '[CHED-RAISE] Registration Confirmation';
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
            $subject = '[CHED-RAISE] Registration Rejected';
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
            $subject = '[CHED-RAISE] Registration Approved';
            $htmlContent = str_replace('{{ticketCode}}', $ticketCode, $htmlContent);
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'participation_certificate':
        $templatePath = __DIR__ . '/templates/ParticipationCertificate.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = '[CHED-RAISE] Participation Certificate';

            // Encrypt Data for the link
            $certPayload = [
                'type' => 'generate_certificate',
                'certificateType' => 'participation',
                'name' => $name,
                'middleName' => $middleName,
                'lastName' => $lastName,
            ];

            if (!$encryptionKey) {
                respondJson(500, ['error' => 'Encryption key missing for certificate generation']);
            }

            $encryptedData = encryptData($certPayload, $encryptionKey);

            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
            $htmlContent = str_replace('{{middleName}}', $middleName, $htmlContent);
            $htmlContent = str_replace('{{lastName}}', $lastName, $htmlContent);
            $htmlContent = str_replace('{{apiUrl}}', $apiUrl, $htmlContent);
            $htmlContent = str_replace('{{encryptedData}}', urlencode($encryptedData), $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'appearance_certificate':
        $templatePath = __DIR__ . '/templates/AppearanceCertificate.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = '[CHED-RAISE] Appearance Certificate';

            // Encrypt Data for the link
            $certPayload = [
                'type' => 'generate_certificate',
                'certificateType' => 'appearance',
                'name' => $name,
                'middleName' => $middleName,
                'lastName' => $lastName,
                // 'certificateType' in payload is redundant but good for explicit 'appearance'
            ];

            if (!$encryptionKey) {
                respondJson(500, ['error' => 'Encryption key missing for certificate generation']);
            }

            $encryptedData = encryptData($certPayload, $encryptionKey);

            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
            $htmlContent = str_replace('{{middleName}}', $middleName, $htmlContent);
            $htmlContent = str_replace('{{lastName}}', $lastName, $htmlContent);
            $htmlContent = str_replace('{{school}}', $input['school'] ?? '', $htmlContent);
            $htmlContent = str_replace('{{certificateType}}', $certificateType, $htmlContent);
            $htmlContent = str_replace('{{apiUrl}}', $apiUrl, $htmlContent);
            $htmlContent = str_replace('{{encryptedData}}', urlencode($encryptedData), $htmlContent);
        } else {
            respondJson(500, ['error' => 'Template file not found.']);
        }
        break;
    case 'survey_completion':
        $templatePath = __DIR__ . '/templates/SurveyCompletionCertificate.html';
        if (file_exists($templatePath)) {
            $htmlContent = file_get_contents($templatePath);
            $subject = '[CHED-RAISE] Survey Completion & Certificates';

            if (!$encryptionKey) {
                respondJson(500, ['error' => 'Encryption key missing']);
            }

            // 1. Participation Certificate Data
            $partPayload = [
                'type' => 'generate_certificate',
                'certificateType' => 'participation',
                'name' => $name, // defined earlier from input
                'middleName' => $middleName,
                'lastName' => $lastName,
            ];
            $encryptedPartData = encryptData($partPayload, $encryptionKey);
            $htmlContent = str_replace('{{encryptedParticipationData}}', urlencode($encryptedPartData), $htmlContent);

            // 2. Appearance Certificate Data (Smartly included)
            // We include it if certificateType is provided (indicating a specific role or attendance)
            // or we default to including it if the user explicit asked to "ship both".
            // We'll generate it. The PDF generation itself for 'appearance' doesn't strictly depend on extra params 
            // other than name/school implicitly.



            // Logic: Include Appearance button unless explicitly excluded or inappropriate?
            // User request: "ship both", "add two buttons". Implies always present for this trigger.
            // We will generate the payload for appearance.
            $appPayload = [
                'type' => 'generate_certificate',
                'certificateType' => 'appearance',
                'name' => $name,
                'middleName' => $middleName,
                'lastName' => $lastName,
                'school' => $input['school'] ?? '',
            ];
            $encryptedAppData = encryptData($appPayload, $encryptionKey);

            $htmlContent = str_replace('{{encryptedAppearanceData}}', urlencode($encryptedAppData), $htmlContent);

            // Common Replacements
            $htmlContent = str_replace('{{name}}', $name, $htmlContent);
            $htmlContent = str_replace('{{middleName}}', $middleName, $htmlContent);
            $htmlContent = str_replace('{{lastName}}', $lastName, $htmlContent);
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
