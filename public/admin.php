<?php
/**
 * Drachen Schänke Zittau - Admin-Verwaltung für Wochenangebote
 * Passwortgeschützte Verwaltungsoberfläche zum Bearbeiten und Überschreiben der angebote.json
 */

session_start();

// Konfiguration
define('ADMIN_PASSWORD', 'Zittau2026!');
define('JSON_FILE_PATH', __DIR__ . '/angebote.json');

$message = null;
$messageType = 'info'; // 'success' | 'error' | 'info'

// 1. Logout verarbeiten
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION['admin_logged_in'] = false;
    session_destroy();
    header('Location: admin.php');
    exit();
}

// 2. Login verarbeiten
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_action'])) {
    $enteredPassword = $_POST['password'] ?? '';
    if (hash_equals(ADMIN_PASSWORD, $enteredPassword)) {
        $_SESSION['admin_logged_in'] = true;
        // Session ID regenerieren für Sicherheit
        session_regenerate_id(true);
        header('Location: admin.php');
        exit();
    } else {
        $message = 'Falsches Passwort! Zugriff verweigert.';
        $messageType = 'error';
    }
}

// Prüfen ob eingeloggt
$isLoggedIn = !empty($_SESSION['admin_logged_in']);

// 3. Speichern der Wochenangebote verarbeiten (Nur wenn eingeloggt)
if ($isLoggedIn && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_offers'])) {
    $rawItems = $_POST['items'] ?? [];
    $cleanItems = [];

    if (is_array($rawItems)) {
        foreach ($rawItems as $item) {
            $name = isset($item['name']) ? trim(strip_tags($item['name'])) : '';
            $preis = isset($item['preis']) ? trim(strip_tags($item['preis'])) : '';
            $beschreibung = isset($item['beschreibung']) ? trim(strip_tags($item['beschreibung'])) : '';

            // Nur speichern, wenn ein Name angegeben ist
            if ($name !== '') {
                $cleanItems[] = [
                    'name' => $name,
                    'preis' => $preis,
                    'beschreibung' => $beschreibung
                ];
            }
        }
    }

    $jsonOutput = json_encode($cleanItems, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($jsonOutput !== false && @file_put_contents(JSON_FILE_PATH, $jsonOutput) !== false) {
        $message = 'Die Wochenangebote wurden erfolgreich in angebote.json gespeichert!';
        $messageType = 'success';
    } else {
        $message = 'Fehler beim Schreiben der angebote.json! Bitte Schreibrechte auf dem Server prüfen.';
        $messageType = 'error';
    }
}

// Aktuelle Angebote laden
$angebote = [];
if ($isLoggedIn && file_exists(JSON_FILE_PATH)) {
    $jsonContent = @file_get_contents(JSON_FILE_PATH);
    if ($jsonContent) {
        $decoded = json_decode($jsonContent, true);
        if (is_array($decoded)) {
            $angebote = $decoded;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wochenangebote Verwalten | Drachen Schänke Zittau</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Faustina:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0c0a09;
            --card-bg: #1c1917;
            --gold-bright: #f59e0b;
            --gold-primary: #d4af37;
            --gold-dim: #92400e;
            --text-cream: #f5f5f4;
            --text-muted: #a8a29e;
            --border-gold: rgba(212, 175, 55, 0.4);
            --danger: #ef4444;
            --success: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-cream);
            font-family: 'Faustina', serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 30px;
        }

        .header h1 {
            font-family: 'Cinzel', serif;
            font-weight: 900;
            color: var(--gold-bright);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .header p {
            color: var(--text-muted);
            font-size: 1rem;
            font-style: italic;
        }

        .container {
            width: 100%;
            max-width: 800px;
            background-color: var(--card-bg);
            border: 2px solid var(--border-gold);
            padding: 30px;
            border-radius: 4px;
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.1);
            position: relative;
        }

        .alert {
            padding: 14px 18px;
            border-radius: 4px;
            margin-bottom: 24px;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .alert-error {
            background-color: rgba(239, 68, 68, 0.15);
            border: 1px solid var(--danger);
            color: #fca5a5;
        }
        .alert-success {
            background-color: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--success);
            color: #6ee7b7;
        }

        /* Login Form */
        .login-box {
            max-width: 400px;
            margin: 40px auto;
            text-align: center;
        }
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        label {
            display: block;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
            color: var(--gold-primary);
            margin-bottom: 6px;
            letter-spacing: 1px;
        }
        input[type="text"],
        input[type="password"],
        textarea {
            width: 100%;
            background-color: #09090b;
            border: 1px solid var(--border-gold);
            color: var(--text-cream);
            padding: 10px 14px;
            font-family: inherit;
            font-size: 1rem;
            border-radius: 3px;
            outline: none;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus,
        input[type="password"]:focus,
        textarea:focus {
            border-color: var(--gold-bright);
        }

        .btn {
            display: inline-block;
            background-color: var(--gold-dim);
            color: #fff;
            border: 1px solid var(--gold-bright);
            font-family: 'Cinzel', serif;
            font-weight: 700;
            text-transform: uppercase;
            padding: 12px 24px;
            cursor: pointer;
            border-radius: 3px;
            letter-spacing: 1px;
            transition: all 0.2s;
            text-decoration: none;
        }
        .btn:hover {
            background-color: var(--gold-bright);
            color: #000;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }
        .btn-success {
            background-color: #065f46;
            border-color: var(--success);
            font-size: 1.1rem;
            padding: 16px 32px;
            width: 100%;
        }
        .btn-success:hover {
            background-color: var(--success);
            color: #000;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }
        .btn-danger {
            background-color: rgba(239, 68, 68, 0.2);
            border-color: var(--danger);
            color: #fca5a5;
            padding: 6px 12px;
            font-size: 0.85rem;
        }
        .btn-danger:hover {
            background-color: var(--danger);
            color: #fff;
        }
        .btn-add {
            background-color: rgba(212, 175, 55, 0.15);
            border: 1px dashed var(--gold-primary);
            color: var(--gold-bright);
            width: 100%;
            margin-bottom: 24px;
            padding: 12px;
        }
        .btn-add:hover {
            background-color: rgba(212, 175, 55, 0.3);
            color: #fff;
        }

        /* Card List */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border-gold);
            padding-bottom: 16px;
        }
        .offer-card {
            background-color: #12100e;
            border: 1px solid rgba(212, 175, 55, 0.25);
            padding: 18px;
            margin-bottom: 16px;
            border-radius: 4px;
            position: relative;
        }
        .offer-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .offer-card-title {
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            color: var(--gold-bright);
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 16px;
            margin-bottom: 12px;
        }
        @media (max-width: 600px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Drachen Schänke Zittau</h1>
        <p>Verwaltung der Wochenangebote</p>
    </div>

    <div class="container">
        <?php if ($message): ?>
            <div class="alert alert-<?= htmlspecialchars($messageType) ?>">
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <?php if (!$isLoggedIn): ?>
            <!-- Login Formular -->
            <div class="login-box">
                <form method="POST" action="admin.php">
                    <input type="hidden" name="login_action" value="1">
                    <div class="form-group">
                        <label for="password">Passwort eingeben</label>
                        <input type="password" id="password" name="password" required autofocus placeholder="Passwort...">
                    </div>
                    <button type="submit" class="btn" style="width: 100%;">Anmelden</button>
                </form>
            </div>
        <?php else: ?>
            <!-- Bearbeitungs-Oberfläche -->
            <div class="top-bar">
                <span style="color: var(--gold-primary); font-family: 'Cinzel', serif;">Eingeloggt als Wirt</span>
                <a href="admin.php?action=logout" class="btn btn-danger">Abmelden</a>
            </div>

            <form method="POST" action="admin.php" id="offers-form">
                <input type="hidden" name="save_offers" value="1">

                <div id="offers-container">
                    <?php if (empty($angebote)): ?>
                        <p id="no-offers-msg" style="color: var(--text-muted); text-align: center; margin-bottom: 20px;">
                            Aktuell sind keine Wochenangebote eingetragen. Klicke auf "Neues Angebot hinzufügen".
                        </p>
                    <?php endif; ?>

                    <?php foreach ($angebote as $idx => $item): ?>
                        <div class="offer-card" data-idx="<?= $idx ?>">
                            <div class="offer-card-header">
                                <span class="offer-card-title">Angebot #<span class="card-num"><?= $idx + 1 ?></span></span>
                                <button type="button" class="btn btn-danger btn-remove" onclick="removeOffer(this)">Löschen</button>
                            </div>
                            <div class="grid-2">
                                <div class="form-group">
                                    <label>Gericht / Name *</label>
                                    <input type="text" name="items[<?= $idx ?>][name]" value="<?= htmlspecialchars($item['name'] ?? '') ?>" required placeholder="z.B. Kassler Schnitzel">
                                </div>
                                <div class="form-group">
                                    <label>Preis</label>
                                    <input type="text" name="items[<?= $idx ?>][preis]" value="<?= htmlspecialchars($item['preis'] ?? '') ?>" placeholder="z.B. 17 Silber & 90 Kupfer">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Beschreibung</label>
                                <textarea name="items[<?= $idx ?>][beschreibung]" rows="2" placeholder="z.B. Mit Grillgemüse und Kartoffelecken"><?= htmlspecialchars($item['beschreibung'] ?? '') ?></textarea>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <button type="button" class="btn btn-add" onclick="addOffer()">+ Neues Angebot hinzufügen</button>

                <div style="margin-top: 10px;">
                    <button type="submit" class="btn btn-success">
                        Wochenangebote speichern (angebote.json überschreiben)
                    </button>
                </div>
            </form>

            <script>
                function updateCardNumbers() {
                    const cards = document.querySelectorAll('.offer-card');
                    cards.forEach((card, index) => {
                        card.setAttribute('data-idx', index);
                        const numSpan = card.querySelector('.card-num');
                        if (numSpan) numSpan.textContent = index + 1;

                        // Update input field names
                        const nameInput = card.querySelector('input[name*="[name]"]');
                        if (nameInput) nameInput.name = `items[${index}][name]`;

                        const preisInput = card.querySelector('input[name*="[preis]"]');
                        if (preisInput) preisInput.name = `items[${index}][preis]`;

                        const descTextarea = card.querySelector('textarea[name*="[beschreibung]"]');
                        if (descTextarea) descTextarea.name = `items[${index}][beschreibung]`;
                    });
                }

                function removeOffer(button) {
                    if (confirm('Möchtest du dieses Angebot wirklich entfernen?')) {
                        const card = button.closest('.offer-card');
                        card.remove();
                        updateCardNumbers();
                    }
                }

                function addOffer() {
                    const container = document.getElementById('offers-container');
                    const noOffersMsg = document.getElementById('no-offers-msg');
                    if (noOffersMsg) noOffersMsg.style.display = 'none';

                    const newIndex = container.querySelectorAll('.offer-card').length;

                    const cardHtml = `
                        <div class="offer-card" data-idx="${newIndex}">
                            <div class="offer-card-header">
                                <span class="offer-card-title">Angebot #<span class="card-num">${newIndex + 1}</span></span>
                                <button type="button" class="btn btn-danger btn-remove" onclick="removeOffer(this)">Löschen</button>
                            </div>
                            <div class="grid-2">
                                <div class="form-group">
                                    <label>Gericht / Name *</label>
                                    <input type="text" name="items[${newIndex}][name]" required placeholder="z.B. Biergulasch">
                                </div>
                                <div class="form-group">
                                    <label>Preis</label>
                                    <input type="text" name="items[${newIndex}][preis]" placeholder="z.B. 16 Silber & 90 Kupfer">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Beschreibung</label>
                                <textarea name="items[${newIndex}][beschreibung]" rows="2" placeholder="z.B. Mit Semmelknödel"></textarea>
                            </div>
                        </div>
                    `;

                    container.insertAdjacentHTML('beforeend', cardHtml);
                    updateCardNumbers();
                }
            </script>
        <?php endif; ?>
    </div>

</body>
</html>
