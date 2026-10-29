# Richtlinie: Strikte MCP-Nutzung (Model Context Protocol)

Diese Regel ist IMMER aktiv für alle Interaktionen, Code-Analysen, Suchvorgänge und Dateiänderungen in diesem Projekt.

## 1. MCP-Werkzeuge haben oberste Priorität
- Sobald MCP-Server (insbesondere `serena` und `context-mode`) konfiguriert oder verfügbar sind, MÜSSEN diese bevorzugt und standardmäßig für alle Aktionen genutzt werden.
- Zu Beginn einer Session ist das Projekt sofort und unaufgefordert mit `serena:activate_project` zu aktivieren und `serena:initial_instructions` aufzurufen.

## 2. Nutzung der MCP-Tools
- **Dateien anlegen:** `serena:create_text_file`
- **Dateien & Symbole lesen:** `serena:read_file`, `serena:get_symbols_overview`, `serena:find_symbol`
- **Code bearbeiten & refaktorisieren:** `serena:replace_content`, `serena:replace_symbol_body`, `serena:insert_after_symbol`, `serena:insert_before_symbol`, `serena:rename_symbol`
- **Projekt durchsuchen:** `serena:search_for_pattern`, `serena:find_file`, `serena:list_dir`
- **Index & Kontext:** `context-mode:ctx_search`, `context-mode:ctx_execute`, `context-mode:ctx_index`
- **Gedächtnis & Wissen:** `serena:write_memory`, `serena:read_memory`

## 3. Keine nativen Fallback-Tools
- Native Werkzeuge (`read_file`, `write_file`, `edit_file`, Shell-Befehle für Dateisuchen) dürfen NICHT verwendet werden, solange die entsprechenden MCP-Tools zur Verfügung stehen.
