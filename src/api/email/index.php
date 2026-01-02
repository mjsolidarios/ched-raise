<?php

function respondJson(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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
// Check request method
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';

// Allow POST for normal API calls
// Allow GET only if 'data' param is present (for certificate generation)
if ($requestMethod !== 'POST' && !($requestMethod === 'GET' && isset($_GET['data']))) {
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

// FPDF will be loaded via composer's autoload


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

    // Create PDF with FPDF
    if (!class_exists('FPDF')) {
        respondJson(500, ['error' => 'FPDF library not found. Please run "composer require setasign/fpdf" in src/api/email.']);
    }

    // Initialize FPDF with A4 Landscape (L, mm, A4)
    $pdf = new FPDF('L', 'mm', 'A4');
    $pdf->AddPage();

    // 1. Draw Background
    // Image path relative to index.php
    $bgPath = __DIR__ . '/certificates/background.png';
    if (file_exists($bgPath)) {
        // Place image at (0,0) with width 297mm and height 210mm
        $pdf->Image($bgPath, 0, 0, 297, 210);
    }

    // 2. Header Text (Below Logos)
    // Logos assumed to be in background at top. Text follows.
    // 2. Header Text (Below Logos)
    // Logos assumed to be in background at top. Text follows.
    $pdf->SetY(40); 
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetTextColor(71, 85, 105); // #475569 slate-600

    // MultiCell for stacking lines closely with specific spacing
    $pdf->Cell(0, 5, strtoupper("Republic of the Philippines"), 0, 1, 'C');
    $pdf->Cell(0, 5, strtoupper("Commission on Higher Education"), 0, 1, 'C');
    $pdf->Cell(0, 5, strtoupper("Northern Iloilo State University | West Visayas State University"), 0, 1, 'C');

    // 3. Set Fonts
    $pdf->SetTextColor(30, 41, 59); // #1e293b dark slate

    // Prepare text
    $certTitle = ($certType === 'appearance') ? 'CERTIFICATE OF APPEARANCE' : 'CERTIFICATE OF PARTICIPATION';
    $certifyText = "This recognition is honorably conferred upon";
    $fullNameUpper = strtoupper($fullName);

    if ($certType === 'appearance') {
        $description = "This is to certify that " . $fullNameUpper . " of " . $school . " appeared at the Iloilo Convention Center on January 28-30, 2026 to attend the CHED-RAISE 2026 Summit.";
    } else {
        $description = "has actively participated in the CHED RAISE 2026 activities.";
    }

    $dateText = "Issued on this " . date('jS') . " day of " . date('F, Y');

    // --- TEXT LAYOUT (Compressed & Dynamic for A4 Landscape) ---

    // Title
    $pdf->SetY(75); 
    $pdf->SetFont('Arial', 'B', 32);
    $pdf->SetTextColor(30, 27, 75); // #1e1b4b
    $pdf->Cell(0, 15, $certTitle, 0, 1, 'C');

    // "This recognition is..."
    $pdf->SetY(90); 
    $pdf->SetFont('Arial', '', 12);
    $pdf->SetTextColor(100, 116, 139); // #64748b
    $pdf->Cell(0, 10, $certifyText, 0, 1, 'C');

    // Name - With Auto Scaling
    $pdf->SetY(102); // Moved up from 105
    $nameFontSize = 42;
    $pdf->SetFont('Times', 'B', $nameFontSize);

    // Check width and scale down if necessary
    $maxWidth = 250; // Max width in mm
    while ($pdf->GetStringWidth($fullNameUpper) > $maxWidth && $nameFontSize > 20) {
        $nameFontSize--;
        $pdf->SetFont('Times', 'B', $nameFontSize);
    }

    $pdf->SetTextColor(2, 6, 23); // #020617
    $pdf->Cell(0, 20, $fullNameUpper, 0, 1, 'C');

    // Name Underline Image
    $nameLinePath = __DIR__ . '/certificates/name-line.png';
    if (file_exists($nameLinePath)) {
        // Reduced gap between name and line
        $pdf->Image($nameLinePath, 73.5, 122, 150); // Y moved to 122
    }

    // Description
    $pdf->SetY(130); // Moved up from 140
    $pdf->SetFont('Arial', '', 14);
    $pdf->SetTextColor(51, 65, 85); // #334155
    $pdf->SetX(40); // Left margin 40mm
    $pdf->MultiCell(217, 8, $description, 0, 'C');

    // Date - Dynamic Position relative to Description
    $currentY = $pdf->GetY();
    // Ensure we don't overlapping with signature or go too low
    // If description was long, add padding.
    $pdf->SetY($currentY + 6); // 6mm buffer

    $pdf->SetFont('Arial', 'B', 10);
    $pdf->SetTextColor(100, 116, 139);
    $pdf->Cell(0, 10, strtoupper($dateText), 0, 1, 'C');

    // Signature Line Image - Fixed at bottom to anchor the design
    $sigY = 172;

    $sigLinePath = __DIR__ . '/certificates/signature-line.png';
    if (file_exists($sigLinePath)) {
        $pdf->Image($sigLinePath, 103.5, $sigY, 90);
    }

    $pdf->SetY($sigY + 3); // Just below line
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->SetTextColor(15, 23, 42);
    $pdf->Cell(0, 8, "DR. RAUL F. MUYONG", 0, 1, 'C');

    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(100, 116, 139);
    $pdf->Cell(0, 5, "Regional Director, CHED RO VI", 0, 1, 'C');

    // Output PDF
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="ched-raise-certificate.pdf"');

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
