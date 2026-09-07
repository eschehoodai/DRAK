<?php
/**
 * Drachen Taverne Zittau - SQLite Datenbank-Verbindung & Initialisierung
 * Automatische Tabellenerstellung und Verwaltung der Tischreservierungen.
 */

// Maximale Standard-Kapazität (Gäste) pro 30-Minuten-Slot
define('MAX_SLOT_CAPACITY', 10);

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
 * Gibt die aktuelle Gäste-Auslastung je Zeitslot für ein bestimmtes Datum zurück.
 *
 * @param PDO $pdo
 * @param string $date (Format: YYYY-MM-DD)
 * @return array<string, int> Mapping von 'HH:MM' => belegte Gäste
 */
function getOccupancyForDate(PDO $pdo, string $date): array {
    $stmt = $pdo->prepare("
        SELECT time, SUM(guests) as total_guests
        FROM reservations
        WHERE date = :date AND status = 'confirmed'
        GROUP BY time
    ");
    $stmt->execute([':date' => $date]);
    
    $occupancy = [];
    while ($row = $stmt->fetch()) {
        $timeSlot = trim($row['time']);
        $occupancy[$timeSlot] = (int)$row['total_guests'];
    }
    return $occupancy;
}
