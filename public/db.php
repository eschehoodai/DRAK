<?php
/**
 * Drachen Taverne Zittau - SQLite Datenbank-Verbindung & Initialisierung
 * Automatische Tabellenerstellung und Verwaltung der Tischreservierungen.
 */

// Kapazitätsgrenzen:
// Standard-Limit für gemischte kleinere Gruppen (max. 10 Personen gesamt)
define('STANDARD_SLOT_CAPACITY', 10);
// Maximallimit für eine einzelne Großgruppe in einem noch leeren Slot (bis zu 20 Personen)
define('MAX_EXCLUSIVE_GROUP_CAPACITY', 20);

/**
 * Gibt eine betriebsbereite PDO-Verbindung zur SQLite-Datenbank zurück.
 * Erstellt die Datei und Tabelle automatisch, falls noch nicht vorhanden.
 *
 * @return PDO
 */
function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }

    $dbFile = $dataDir . '/reservations.sqlite';
    $pdo = new PDO('sqlite:' . $dbFile, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 5,
    ]);

    // WAL-Modus für optimale Performance bei gleichzeitigen Zugriffen
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA busy_timeout = 5000;");

    // Tabelle initialisieren, falls noch nicht vorhanden
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            guests INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            vault TEXT,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_date_time_status ON reservations (date, time, status);
    ");

    return $pdo;
}

/**
 * Gibt detaillierte Belegungsdaten je Zeitslot für ein bestimmtes Datum zurück.
 * Erfasst Gesamtzahl der Gäste, Anzahl der Buchungen und ob eine Großgruppe (>10) gebucht hat.
 *
 * @param PDO $pdo
 * @param string $date (Format: YYYY-MM-DD)
 * @return array<string, array{total_guests: int, booking_count: int, has_large_group: bool}>
 */
function getOccupancyDetailsForDate(PDO $pdo, string $date): array {
    $stmt = $pdo->prepare("
        SELECT time, guests
        FROM reservations
        WHERE date = :date AND status = 'confirmed'
    ");
    $stmt->execute([':date' => $date]);
    
    $occupancy = [];
    while ($row = $stmt->fetch()) {
        $timeSlot = trim($row['time']);
        $guests = (int)$row['guests'];
        if (!isset($occupancy[$timeSlot])) {
            $occupancy[$timeSlot] = [
                'total_guests'    => 0,
                'booking_count'   => 0,
                'has_large_group' => false
            ];
        }
        $occupancy[$timeSlot]['total_guests'] += $guests;
        $occupancy[$timeSlot]['booking_count']++;
        if ($guests > STANDARD_SLOT_CAPACITY) {
            $occupancy[$timeSlot]['has_large_group'] = true;
        }
    }
    return $occupancy;
}
