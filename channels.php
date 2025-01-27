<?php
header('Content-Type: application/json');

$channelsFile = 'channels.json';

// Handle GET requests to fetch the channel list
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($channelsFile)) {
        $channels = file_get_contents($channelsFile);

        // Check if the file content is valid JSON
        if (json_decode($channels) !== null) {
            echo $channels;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Invalid JSON in channels file.']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Channels file not found.']);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405); // Method Not Allowed
echo json_encode(['error' => 'Invalid request method.']);
exit;
