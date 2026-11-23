<?php
/**
 * Drachen Taverne Zittau - API-Endpunkt zur Suche einer Reservierung im Folianten
 * Sucht schreibgeschützt (Read-Only) in SQLite (und Fallback-Queue) nach
 * 6-stelligem Buchungscode (z.B. DRAK-482193 oder 482193) oder Telefonnummer.
 */

// Headers für JSON Response & CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error"   => "Methode nicht erlaubt."
    ]);
    exit();
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($query === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error"   => "Bitte tragt einen gültigen 6-stelligen Reservierungscode oder Eure Telefonnummer ein."
    ]);
    exit();
}

// Bereinigte Suchbegriffe
$lowerQuery = mb_strtolower($query, 'UTF-8');
$cleanAlnum = preg_replace('/[^a-z0-9]/', '', $lowerQuery);
$cleanDigits = preg_replace('/[^0-9]/', '', $lowerQuery);

// Mindestlänge prüfen (6-stelliger Code oder mind. 5 Ziffern einer Telefonnummer)
$isPossibleCode = (strlen($cleanAlnum) >= 6);
$isPossiblePhone = (strlen($cleanDigits) >= 5);

if (!$isPossibleCode && !$isPossiblePhone) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error"   => "Bitte gebt den vollständigen 6-stelligen Reservierungscode (z.B. DRAK-482193 oder 482193) oder Eure Telefonnummer ein."
    ]);
    exit();
}

require_once __DIR__ . '/db.php';

/**
 * Prüft, ob eine Reservierung zum Suchbegriff passt (6-stelliger Code oder Telefonnummer).
 */
function matchesReservation(array $row, string $lowerQuery, string $cleanAlnum, string $cleanDigits): bool {
    $resId = mb_strtolower((string)($row['id'] ?? ''), 'UTF-8');
    $cleanResId = preg_replace('/[^a-z0-9]/', '', $resId);

    // 1. Direkter ID-Treffer (z.B. "drak-482193" oder "drak482193")
    if ($resId !== '' && ($resId === $lowerQuery || $cleanResId === $cleanAlnum)) {
        return true;
    }

    // 2. 6-stelliger Nummern-Code ohne Präfix (z.B. "482193" findet "DRAK-482193" oder "DRAK-482193-12")
    if (strlen($cleanDigits) === 6 && $cleanAlnum === $cleanDigits) {
        if (preg_match('/^drak' . preg_quote($cleanDigits, '/') . '(\d{2})?$/', $cleanResId)) {
            return true;
        }
    }

    // 3. Telefonnummer-Treffer (ignoriert Leerzeichen, Bindestriche, Schrägstriche)
    if (strlen($cleanDigits) >= 5 && !empty($row['phone'])) {
        $cleanPhone = preg_replace('/[^0-9]/', '', (string)$row['phone']);
        if ($cleanPhone !== '' && strpos($cleanPhone, $cleanDigits) !== false) {
            return true;
        }
    }

    return false;
}

try {
    $pdo = getDb();

    // Ausschließlich aktive Reservierungen (confirmed & inquiry) lesend abfragen;
    // interne Wirts-Sperren (blocked) und stornierte Buchungen (cancelled) werden ausgeschlossen.
    // Sortierung: Anstehende Termine zuerst (nächster Termin oben), danach jüngste vergangene.
    $today = date('Y-m-d');
    $stmt = $pdo->prepare("
        SELECT id, name, phone, guests, date, time, vault, notes, status
        FROM reservations
        WHERE status IN ('confirmed', 'inquiry')
        ORDER BY
            CASE WHEN date >= :today THEN 0 ELSE 1 END ASC,
            CASE WHEN date >= :today THEN date END ASC,
            CASE WHEN date >= :today THEN time END ASC,
            date DESC,
            time DESC
    ");
    $stmt->execute([':today' => $today]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Falls Einträge in der Fallback-Queue liegen, ebenfalls lesend berücksichtigen
    $fallbackRows = getFallbackReservations();
    if (!empty($fallbackRows)) {
        $existingIds = [];
        foreach ($rows as $r) {
            $existingIds[$r['id']] = true;
        }
        foreach ($fallbackRows as $fb) {
            $fbStatus = $fb['status'] ?? 'confirmed';
            if (in_array($fbStatus, ['confirmed', 'inquiry'], true) && empty($existingIds[$fb['id'] ?? ''])) {
                $rows[] = $fb;
            }
        }
    }

    $found = null;
    foreach ($rows as $row) {
        if (matchesReservation($row, $lowerQuery, $cleanAlnum, $cleanDigits)) {
            $found = [
                'id'     => (string)($row['id'] ?? ''),
                'name'   => (string)($row['name'] ?? ''),
                'phone'  => !empty($row['phone']) ? (string)$row['phone'] : '',
                'guests' => (int)($row['guests'] ?? 1),
                'date'   => (string)($row['date'] ?? ''),
                'time'   => (string)($row['time'] ?? ''),
                'vault'  => (string)($row['vault'] ?? 'Die Grosse Kathedrale'),
                'notes'  => !empty($row['notes']) ? (string)$row['notes'] : '',
                'status' => (string)($row['status'] ?? 'confirmed'),
            ];
            break;
        }
    }

    if ($found !== null) {
        echo json_encode([
            "success"     => true,
            "reservation" => $found
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "success" => false,
            "error"   => "Kein Zunftbrief unter diesem Reservierungscode oder dieser Telefonnummer gefunden. Überprüft Eure Inschrift."
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Datenbankfehler bei der Suche im Folianten."
    ], JSON_UNESCAPED_UNICODE);
}
