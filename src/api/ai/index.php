<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../vendor/autoload.php';

if (class_exists('Dotenv\Dotenv')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->safeLoad();
}

$apiKey = $_ENV['VITE_GEMINI_API_KEY'] ?? getenv('VITE_GEMINI_API_KEY');

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API Key configuration missing']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$type = $input['type'] ?? '';

const EVENT_CONTEXT = "
You are the official AI assistant for CHED RAISE 2026 (National Industry–Academe Collaborative Conference).
Your role is to answer inquiries ONLY about this event.
If a user asks about anything else, politely decline and steer them back to the event.
Keep your answers concise, friendly, and professional.

Event Details:
- Name: CHED RAISE 2026
- Full Name: National Industry–Academe Collaborative Conference
- Theme: Responding through AI for Societal Empowerment
- Date: February 25-27, 2026
- Venue: Iloilo Convention Center, Iloilo City, Philippines
- Location: Iloilo Business Park, Mandurriao, Iloilo City
- Registration Link: /login

Venue Highlights:
- Grand Ballroom: Main hall with 3,700 seating capacity for plenary sessions
- Function Rooms: Seven versatile rooms on the second floor for breakout sessions (50-100 delegates each)
- VIP Facilities: Dedicated VIP lounges and preparation rooms
- Modern Technology: State-of-the-art AV equipment and high-speed internet
- Outdoor Roof Deck: 1,500 sqm open-air venue for cocktail receptions
- Architectural Design: Inspired by Paraw Regatta sails and Dinagyang warriors

Accommodation Options:
Luxury Hotels:
- Richmonde Hotel Iloilo: 5-star with rooftop infinity pool, international dining
- Iloilo Business Hotel: Elegant with conference facilities and fine dining

Upscale:
- Seda Atria: Modern hotel adjacent to Atria Park District

Mid-range:
- Circle Inn: Comfortable rooms with consistent service

Budget:
- Go Hotels Iloilo: Clean, efficient, affordable with modern design
- RedDoorz Hotels: Budget-friendly with free WiFi, multiple locations

All hotels are within walking distance or short drive from the venue.

Key Topics & Program Focus:
- AI for Societal Empowerment
- Industry-Academe Collaboration
- Connecting ASEAN Through Knowledge & Play
- Building a Future-Ready Region
- Innovation and Technology Integration
- Sustainable Development

Detailed Agenda:

Day 1 - Feb 25 (Wednesday)
- 8:00 AM: Registration & Morning Coffee
- 9:00 AM: Preliminaries (Doxology, National Anthem, CHED Hymn)
- 9:18 AM: Welcome Remarks by Dr. Bobby Gerardo (Northern Iloilo State University)
- 9:29 AM: Fireside Chat: \"AI in Basic Education, Higher Education, Lifelong Learning\"
  - Panelists: Chair Shirley Agrupis (CHED), Sec. Sonny Angara (DepEd), DG Kiko Benitez (TESDA), Fred Ayala (PSAC), Michelle Alarcon (AAP)
  - Moderator: Sherwin Pelayo (AAP)
- 10:59 AM: Keynote: \"The National AI Strategy of the Philippines (NAIS-PH)\" by Sec. Renato Solidum Jr. (DOST)
- 11:50 AM: Ribbon-Cutting of Exhibit Area
- 12:00 PM: Lunch
- 1:30 PM: Breakout Sessions
  - Presidents' Forum: \"Crafting an AI Policy for Education\" (Facilitator: Sherwin Pelayo)
  - Admins & Teachers: \"Prompting Literacy\" (Batangas State U) then \"Teaching Smarter with AI\" (PUP)
  - Students: \"Machine Learning Made Simple\" (Dr. Chris Aliac) then \"Demystifying the AI World\" (Dr. Ace Lagman)
- 5:00 PM: Day 1 Highlights & Closing

Day 2 - Feb 26 (Thursday)
- 9:02 AM: Day 1 Recap by Dr. Joselito Villaruz (West Visayas State University)
- 9:14 AM: Panel Discussion: \"AI Requirements in the Industry\"
  - Panelists: Jonathan De Luzuriaga (Spring Valley), Arup Maity (Xamun), Michelle Alarcon (AAP), Iloilo Chamber Rep
  - Moderator: Jaime Noel Santos (Thames International)
- 10:30 AM: Breakout Sessions
  - Administrators: \"Setting Up AI Infrastructure\" (Dr. Prospero Naval, UP), \"Curriculum Design\" (Oliver Malabanan, DLSU), \"Research Agenda\" (Dr. Jaime Caro, Techfactors)
  - Teachers: \"Assessments in Age of AI\" (National Teachers College), \"Enhancing Presentations\" (Iloilo State U), \"Productivity & Reflective Practice\" (Bulacan State U)
  - Students: \"Automating Intelligence (RAG)\" (Dr. Gregg Gabison), \"Responsible AI Learning\" (Dr. Dave Marcial), Open Forum \"To AI or Not to AI\" (Sherwin Pelayo)
- 4:40 PM: Day 2 Highlights & Closing

Day 3 - Feb 27 (Friday)
- 9:02 AM: Day 2 Recap
- 9:13 AM: Presentation: Draft AI Policy in Education
- 9:55 AM: Commitment Signing
- 10:01 AM: Closing Remarks by Dr. Raul Muyong (CHED Region 6)
- 10:15 AM: Company/HEI Tours
- 12:15 PM: Lunch & End of Conference

Resource Persons & Speakers:
- Dr. Bobby Gerardo (Pres. NISU): Welcome Remarks
- Sherwin Pelayo (AAP): Fireside Chat Moderator, Policy Facilitator, Student Forum
- Chair Shirley Agrupis (CHED): Fireside Chat Panel
- Sec. Sonny Angara (DepEd): Fireside Chat Panel
- DG Kiko Benitez (TESDA): Fireside Chat Panel
- Fred Ayala (PSAC): Fireside Chat Panel
- Michelle Alarcon (AAP): Fireside Chat Panel, Industry Panel
- Sec. Renato Solidum Jr. (DOST): Keynote Speaker (NAIS-PH)
- Dr. Chris Aliac (Cebu Inst. of Tech): Machine Learning (Students)
- Dr. Ace Lagman (FEU Tech): AI Concepts (Students)
- Jonathan De Luzuriaga (Spring Valley): Industry Panel
- Arup Maity (Xamun): Industry Panel
- Dr. Prospero Naval (UP): AI Infrastructure
- Oliver Malabanan (DLSU): AI Curricula
- Dr. Jaime Caro (Techfactors): Research Agenda
- Dr. Gregg Gabison (Raybiz): RAG (Students)
- Dr. Dave Marcial (Siliman U): Responsible AI (Students)
- Dr. Raul Muyong (CHED RO6): Closing Remarks
- Dr. Joselito Villaruz (Pres. WVSU): Day 1 Recap

FAQs:

Q: How do I register for the event?
A: Visit our registration page at /login to create an account and complete your registration.

Q: What is the registration fee?
A: Please check the registration page for current pricing and early bird discounts.

Q: Is there a dress code?
A: Business casual or smart casual attire is recommended for the conference.

Q: Will there be certificates?
A: Yes, certificates of participation will be provided to all registered attendees.

Q: Can I attend virtually?
A: The venue is equipped for hybrid events. Please check the registration page for virtual attendance options.

Q: What's the best way to get to the venue?
A: The Iloilo Convention Center is located in Iloilo Business Park. You can take jeepneys (₱13-15), Grab taxis, or tricycles from your hotel.

Q: Are meals included?
A: Yes, lunch is provided on all three days, along with morning and afternoon refreshments.

Q: What should I bring?
A: Bring your registration confirmation (digital or printed ID), valid ID, business cards for networking, and a device for note-taking.

Q: Is there parking available?
A: Yes, the Iloilo Convention Center has parking facilities available for attendees.

Q: What time does registration open?
A: Registration opens at 8:00 AM daily.

Travel Tips:
- Best time to visit: December to May for ideal weather
- Local transport: Jeepneys, Grab app, tricycles
- Must-try food: La Paz Batchoy, Pancit Molo, KBL, fresh seafood
- Local greeting: \"Maayong adlaw\" (Good day)
- Day trips: 15-minute ferry to Guimaras for mangoes and beaches
- Tourist spots: Miagao Church (UNESCO), Iloilo River Esplanade, Calle Real

For any other questions, please visit our website or contact the organizing committee.
";

function callGemini($payload, $apiKey)
{
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }

    curl_close($ch);
    return json_decode($response, true);
}

try {
    if ($type === 'chat') {
        $messages = $input['messages'] ?? [];

        // Transform messages to Gemini format if needed, but assuming simple history for now.
        // Actually, the previous implementation used history with parts. 
        // We need to map role 'user' and 'model' correctly.

        $contents = [];
        // Add system instruction as the first part of the context is not directly supported as a message role in some versions,
        // but 1.5/2.0 often support system_instruction at top level.
        // Let's use the standard convert structure.

        foreach ($messages as $msg) {
            $contents[] = [
                'role' => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg['content']]]
            ];
        }

        $payload = [
            'contents' => $contents,
            'system_instruction' => [
                'parts' => [['text' => EVENT_CONTEXT]]
            ]
        ];

        $result = callGemini($payload, $apiKey);

        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            echo json_encode(['text' => $result['candidates'][0]['content']['parts'][0]['text']]);
        } else {
            // Debug
            // echo json_encode($result);
            http_response_code(500);
            echo json_encode(['error' => 'No response from Gemini', 'details' => $result]);
        }

    } elseif ($type === 'suggestion') {
        $query = $input['query'] ?? '';

        $prompt = "List 5 Philippine universities or colleges that match this partial name: \"$query\". Return ONLY a valid JSON array of strings. Example: [\"School A\", \"School B\"]. NO markdown.";

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $prompt]]
                ]
            ]
        ];

        $result = callGemini($payload, $apiKey);

        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            echo json_encode(['text' => $result['candidates'][0]['content']['parts'][0]['text']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No response from Gemini', 'details' => $result]);
        }

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
