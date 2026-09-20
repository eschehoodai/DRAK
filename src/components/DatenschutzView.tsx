import React, { useEffect } from 'react';
import { useCookieConsent } from '../context/CookieContext';

export default function DatenschutzView() {
  const { openSettings } = useCookieConsent();

  useEffect(() => {
    document.title = 'Datenschutzerklärung – Drachen Taverne';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Datenschutzerklärung der Drachen Taverne (Drak Zittau DLR Gastro Event UG) gemäß DSGVO.');
    }
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative mx-auto max-w-[800px] px-4 py-12 md:px-8 md:py-16 print:py-4 print:px-0">
      {/* ── Titel ── */}
      <h1 className="font-cinzel text-3xl md:text-4xl font-extrabold tracking-widest text-gold-bright mb-8 uppercase text-center">
        Datenschutzerklärung
      </h1>

      {/* ── Inhaltsverzeichnis ── */}
      <nav aria-label="Inhaltsverzeichnis" className="mb-12 border border-gold-secondary/20 bg-tavern-dark/50 p-5 md:p-6 print:border-black print:bg-white">
        <p className="font-cinzel text-xs font-bold tracking-widest text-gold-primary uppercase mb-3">
          Inhaltsverzeichnis
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-cream-parchment/70">
          {[
            ['sec-hinweise', 'Allgemeine Hinweise zur Datensicherheit'],
            ['sec-verantwortlicher', '1. Verantwortlicher'],
            ['sec-dsb', '2. Datenschutzbeauftragter'],
            ['sec-logfiles', '3. Server-Logfiles'],
            ['sec-cookies', '4. Cookies'],
            ['sec-reservierung', '5. Reservierungsformular'],
            ['sec-bewerbung', '6. Bewerbungsformular'],
            ['sec-fonts', '7. Google Fonts'],
            ['sec-google-ads', '8. Google Ads & Conversion Tracking'],
            ['sec-empfaenger', '9. Empfänger der Daten'],
            ['sec-drittland', '10. Drittlandtransfer'],
            ['sec-rechte', '11. Ihre Rechte als betroffene Person'],
            ['sec-widerruf', '12. Widerrufsrecht bei Einwilligung'],
            ['sec-beschwerde', '13. Beschwerderecht bei einer Aufsichtsbehörde'],
            ['sec-bereitstellung', '14. Pflicht zur Bereitstellung von Daten'],
            ['sec-loeschung', '15. Routinemäßige Löschung und Sperrung von personenbezogenen Daten'],
            ['sec-profiling', '16. Automatisierte Entscheidungsfindung'],
            ['sec-stand', '17. Aktualität und Änderung dieser Datenschutzerklärung'],
          ].map(([id, label]) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="text-left hover:text-gold-bright transition-colors underline underline-offset-2 decoration-gold-secondary/30 cursor-pointer"
              >
                {label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Inhalt ── */}
      <div className="space-y-10 text-sm leading-relaxed text-cream-parchment/80 print:text-black print:leading-normal">

        {/* Allgemeine Hinweise zur Datensicherheit */}
        <section id="sec-hinweise">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            Allgemeine Hinweise zur Datensicherheit
          </h2>
          <p>
            Die DLR Gastro Event UG hat als für die Verarbeitung Verantwortlicher zahlreiche technische und
            organisatorische Maßnahmen umgesetzt, um einen möglichst lückenlosen Schutz der über diese Internetseite
            verarbeiteten personenbezogenen Daten sicherzustellen. Dennoch können Internetbasierte Datenübertragungen
            grundsätzlich Sicherheitslücken aufweisen, sodass ein absoluter Schutz nicht gewährleistet werden kann.
            Aus diesem Grund steht es jeder betroffenen Person frei, personenbezogene Daten auch auf alternativen Wegen,
            beispielsweise telefonisch, an uns zu übermitteln.
          </p>
        </section>

        {/* 1. Verantwortlicher */}
        <section id="sec-verantwortlicher">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            1. Verantwortlicher
          </h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer
            nationaler Datenschutzgesetze sowie sonstiger datenschutzrechtlicher Bestimmungen ist:
          </p>
          <address className="not-italic mt-3 space-y-0.5 pl-4 border-l-2 border-gold-secondary/20">
            <p className="font-bold text-cream-parchment">Drak Zittau DLR Gastro Event UG</p>
            <p>Innere Weberstraße 11</p>
            <p>02763 Zittau</p>
            <p className="pt-1">Vertreten durch: Robert Koch</p>
            <p className="pt-1">Telefon: 03583 5495389</p>
            <p>
              E-Mail:{' '}
              <a href="mailto:drakzittau@dlr-gastro-event.de" className="text-gold-bright hover:underline">
                drakzittau@dlr-gastro-event.de
              </a>
            </p>
          </address>
        </section>

        {/* 2. Datenschutzbeauftragter */}
        <section id="sec-dsb">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            2. Datenschutzbeauftragter
          </h2>
          <p>
            Eine Pflicht zur Bestellung eines Datenschutzbeauftragten besteht derzeit nicht. Bei
            Fragen zum Datenschutz wenden Sie sich bitte an die oben genannte Kontaktadresse.
          </p>
        </section>

        {/* 3. Server-Logfiles */}
        <section id="sec-logfiles">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            3. Server-Logfiles
          </h2>
          <p>
            Der Hosting-Anbieter dieser Website erhebt und speichert automatisch Informationen in
            sogenannten Server-Logfiles, die Ihr Browser automatisch übermittelt. Dies sind:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>IP-Adresse des anfragenden Rechners</li>
            <li>Datum und Uhrzeit der Anfrage</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Übertragene Datenmenge</li>
            <li>Browsertyp und -version</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer-URL (zuvor besuchte Seite)</li>
          </ul>
          <div className="mt-3 space-y-1">
            <p><span className="text-gold-secondary font-bold">Zweck:</span> Gewährleistung eines reibungslosen Verbindungsaufbaus, Systemsicherheit und -stabilität.</p>
            <p><span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
            <p><span className="text-gold-secondary font-bold">Speicherdauer:</span> Die Logfiles werden vom Hosting-Anbieter gespeichert und nach dessen Löschfristen entfernt (in der Regel 7–30 Tage).</p>
          </div>
        </section>

        {/* 4. Cookies */}
        <section id="sec-cookies">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            4. Cookies
          </h2>
          <p>
            Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem
            Endgerät gespeichert werden und die Ihr Browser speichert.
          </p>

          <h3 className="font-cinzel text-sm font-bold tracking-wider text-gold-secondary uppercase mt-4 mb-2">
            4.1 Notwendige Cookies
          </h3>
          <p>
            Diese Cookies sind für den Betrieb der Website erforderlich und können nicht
            deaktiviert werden. Sie speichern z.&nbsp;B. Ihre Cookie-Einstellungen.
          </p>
          <p className="mt-1">
            <span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
          </p>

          <h3 className="font-cinzel text-sm font-bold tracking-wider text-gold-secondary uppercase mt-4 mb-2">
            4.2 Funktionale Cookies
          </h3>
          <p>
            Diese Cookies ermöglichen erweiterte Funktionen wie eingebettete Inhalte und
            Kartendienste. Sie werden nur nach Ihrer ausdrücklichen Einwilligung gesetzt.
          </p>
          <p className="mt-1">
            <span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>

          <h3 className="font-cinzel text-sm font-bold tracking-wider text-gold-secondary uppercase mt-4 mb-2">
            4.3 Analyse-Cookies
          </h3>
          <p>
            Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen, um sie zu
            verbessern. Sie werden nur nach Ihrer ausdrücklichen Einwilligung gesetzt.
          </p>
          <p className="mt-1">
            <span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>

          <p className="mt-4">
            Sie können Ihre Cookie-Einstellungen jederzeit über unseren{' '}
            <button
              onClick={openSettings}
              className="text-gold-bright hover:underline underline-offset-2 cursor-pointer"
            >
              Cookie-Einstellungen-Dialog
            </button>{' '}
            anpassen oder widerrufen.
          </p>
        </section>

        {/* 5. Reservierungsformular */}
        <section id="sec-reservierung">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            5. Reservierungsformular
          </h2>
          <p>
            Wenn Sie über unser Reservierungsformular eine Tischreservierung vornehmen, erheben
            wir folgende Daten:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>Name</li>
            <li>Telefonnummer</li>
            <li>Anzahl der Gäste</li>
            <li>Gewünschtes Datum und Uhrzeit</li>
            <li>Gewünschter Bereich</li>
            <li>Optionale Anmerkungen</li>
          </ul>
          <div className="mt-3 space-y-1">
            <p><span className="text-gold-secondary font-bold">Zweck:</span> Durchführung und Verwaltung Ihrer Tischreservierung.</p>
            <p><span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).</p>
            <p><span className="text-gold-secondary font-bold">Speicherdauer:</span> Die Daten werden nach Ablauf des Reservierungstermins gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
          </div>
        </section>

        {/* 6. Bewerbungsformular */}
        <section id="sec-bewerbung">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            6. Bewerbungsformular
          </h2>
          <p>
            Bei einer Bewerbung über unser Online-Formular erheben wir folgende Daten:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Gewünschte Position</li>
            <li>Freitext zur Person (optional)</li>
          </ul>
          <div className="mt-3 space-y-1">
            <p><span className="text-gold-secondary font-bold">Zweck:</span> Durchführung des Bewerbungsverfahrens.</p>
            <p><span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) i.&nbsp;V.&nbsp;m. § 26 BDSG.</p>
            <p><span className="text-gold-secondary font-bold">Speicherdauer:</span> Die Daten werden spätestens 6 Monate nach Abschluss des Bewerbungsverfahrens gelöscht, sofern keine Einwilligung zur längeren Speicherung vorliegt.</p>
          </div>
        </section>

        {/* 7. Google Fonts */}
        <section id="sec-fonts">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            7. Google Fonts
          </h2>
          <p>
            Diese Website nutzt zur einheitlichen Darstellung von Schriftarten sogenannte Google
            Fonts, bereitgestellt von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
            Irland.
          </p>
          <p className="mt-2">
            Beim Aufruf einer Seite lädt Ihr Browser die benötigten Schriftarten direkt von
            Google-Servern. Dabei wird Ihre IP-Adresse an Google übermittelt. Google Fonts werden
            im Cache Ihres Browsers gespeichert und bei weiteren Seitenaufrufen nicht erneut
            geladen.
          </p>
          <div className="mt-3 space-y-1">
            <p><span className="text-gold-secondary font-bold">Zweck:</span> Einheitliche und ansprechende Darstellung der Website.</p>
            <p><span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer optimalen Darstellung).</p>
            <p><span className="text-gold-secondary font-bold">Drittlandtransfer:</span> Es kann eine Übermittlung in die USA stattfinden. Google ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert.</p>
          </div>
          <p className="mt-2">
            Weitere Informationen finden Sie in der{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-bright hover:underline"
            >
              Datenschutzerklärung von Google
            </a>.
          </p>
        </section>

        {/* 8. Google Ads & Conversion Tracking */}
        <section id="sec-google-ads">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            8. Google Ads & Conversion Tracking
          </h2>
          <p>
            Diese Website nutzt das Online-Werbeprogramm „Google Ads“ und im Rahmen dessen das Google Tag
            (gtag.js) sowie das Conversion-Tracking von Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland („Google“).
          </p>
          <p className="mt-2">
            Wenn Sie über eine von Google geschaltete Anzeige auf unsere Website gelangen, wird von Google
            ein Cookie oder ein Identifier für das Conversion-Tracking auf Ihrem Endgerät abgelegt, sofern
            Sie dem in unserem Cookie-Banner zugestimmt haben. Mit Hilfe dieser Cookies und Messpunkte können
            wir nachvollziehen, ob ein Klick auf eine Anzeige zu einer erfolgreichen Tischreservierung oder
            einem Klick auf unsere Telefonnummer geführt hat.
          </p>
          <div className="mt-3 space-y-1">
            <p><span className="text-gold-secondary font-bold">Zweck:</span> Statistische Erfolgsmessung unserer Werbemaßnahmen zur Tischreservierung und Ausspielung relevanter Angebote.</p>
            <p><span className="text-gold-secondary font-bold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO sowie § 25 Abs. 1 TDDDG (Einwilligung über den Cookie-Banner).</p>
            <p><span className="text-gold-secondary font-bold">Google Consent Mode:</span> Wir setzen den Google Consent Mode v2 ein. Standardmäßig werden alle Werbe- und Analyse-Cookies blockiert, bis Sie im Cookie-Banner ausdrücklich zustimmen.</p>
            <p><span className="text-gold-secondary font-bold">Drittlandtransfer:</span> Daten können an Server der Google LLC in die USA übermittelt werden. Google ist nach dem EU-U.S. Data Privacy Framework (DPF) zertifiziert.</p>
          </div>
          <p className="mt-2">
            Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie die{' '}
            <button
              onClick={openSettings}
              className="text-gold-bright hover:underline underline-offset-2 cursor-pointer"
            >
              Cookie-Einstellungen
            </button>{' '}
            aufrufen und dort die Analyse- & Marketing-Kategorie deaktivieren.
          </p>
        </section>

        {/* 9. Empfänger der Daten */}
        <section id="sec-empfaenger">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            9. Empfänger der Daten
          </h2>
          <p>Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur, wenn:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
            <li>Sie ausdrücklich eingewilligt haben (Art. 6 Abs. 1 lit. a DSGVO),</li>
            <li>die Weitergabe zur Vertragserfüllung erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO),</li>
            <li>eine gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO),</li>
            <li>ein berechtigtes Interesse besteht (Art. 6 Abs. 1 lit. f DSGVO).</li>
          </ul>
          <p className="mt-3">
            <span className="text-gold-secondary font-bold">Hosting-Anbieter:</span> Diese Website wird bei einem externen Hosting-Anbieter betrieben. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosting-Anbieters gespeichert. Ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO wurde geschlossen.
          </p>
        </section>

        {/* 10. Drittlandtransfer */}
        <section id="sec-drittland">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            10. Drittlandtransfer
          </h2>
          <p>
            Durch die Einbindung von Google Fonts und Google Ads / Conversion Tracking kann eine Datenübermittlung in die USA
            stattfinden. Die USA verfügen mit dem EU-U.S. Data Privacy Framework (DPF) über
            einen Angemessenheitsbeschluss der Europäischen Kommission. Google LLC ist unter dem
            DPF zertifiziert, sodass ein angemessenes Datenschutzniveau gewährleistet ist.
          </p>
          <p className="mt-2">
            Darüber hinaus findet kein Transfer personenbezogener Daten in Drittländer statt.
          </p>
        </section>

        {/* 11. Ihre Rechte als betroffene Person */}
        <section id="sec-rechte">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            11. Ihre Rechte als betroffene Person
          </h2>
          <p>Sie haben nach der DSGVO folgende Rechte:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 pl-2">
            <li>
              <span className="text-cream-parchment font-bold">Recht auf Bestätigung:</span>{' '}
              Jede betroffene Person hat das Recht, von dem für die Verarbeitung Verantwortlichen eine Bestätigung darüber zu verlangen, ob sie betreffende personenbezogene Daten verarbeitet werden.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Auskunftsrecht (Art. 15 DSGVO):</span>{' '}
              Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Berichtigungsrecht (Art. 16 DSGVO):</span>{' '}
              Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Löschungsrecht (Art. 17 DSGVO):</span>{' '}
              Sie haben das Recht, die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Einschränkung der Verarbeitung (Art. 18 DSGVO):</span>{' '}
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Datenübertragbarkeit (Art. 20 DSGVO):</span>{' '}
              Sie haben das Recht, Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.
            </li>
            <li>
              <span className="text-cream-parchment font-bold">Widerspruchsrecht (Art. 21 DSGVO):</span>{' '}
              Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen, sofern die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht.
            </li>
          </ul>
          <p className="mt-3">
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
            <a href="mailto:drakzittau@dlr-gastro-event.de" className="text-gold-bright hover:underline">
              drakzittau@dlr-gastro-event.de
            </a>
          </p>
        </section>

        {/* 12. Widerrufsrecht bei Einwilligung */}
        <section id="sec-widerruf">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            12. Widerrufsrecht bei Einwilligung
          </h2>
          <p>
            Soweit die Verarbeitung Ihrer personenbezogenen Daten auf einer Einwilligung beruht,
            haben Sie das Recht, diese Einwilligung jederzeit mit Wirkung für die Zukunft zu
            widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf
            erfolgten Verarbeitung wird dadurch nicht berührt.
          </p>
          <p className="mt-2">
            Ihre Cookie-Einwilligung können Sie jederzeit über die{' '}
            <button
              onClick={openSettings}
              className="text-gold-bright hover:underline underline-offset-2 cursor-pointer"
            >
              Cookie-Einstellungen
            </button>{' '}
            widerrufen.
          </p>
        </section>

        {/* 13. Beschwerderecht bei einer Aufsichtsbehörde */}
        <section id="sec-beschwerde">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            13. Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <p>
            Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs
            steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der
            Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO
            verstößt.
          </p>
          <p className="mt-2">Die für uns zuständige Aufsichtsbehörde ist:</p>
          <address className="not-italic mt-2 pl-4 border-l-2 border-gold-secondary/20 space-y-0.5">
            <p className="font-bold text-cream-parchment">Sächsischer Datenschutzbeauftragter</p>
            <p>Devrientstraße 1</p>
            <p>01067 Dresden</p>
          </address>
        </section>

        {/* 14. Pflicht zur Bereitstellung von Daten */}
        <section id="sec-bereitstellung">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            14. Pflicht zur Bereitstellung von Daten
          </h2>
          <p>
            Wir klären Sie darüber auf, dass die Bereitstellung personenbezogener Daten zum Teil
            gesetzlich vorgeschrieben ist (z.B. Steuervorschriften) oder sich auch aus vertraglichen
            Regelungen (z.B. Angaben zum Vertragspartner) ergeben kann. Für die Nutzung unserer
            Reservierungsfunktion ist die Angabe bestimmter Daten (Name, E-Mail, Gästeanzahl) jedoch
            zwingend erforderlich. Ohne diese Angaben kann die Reservierung nicht durchgeführt werden.
          </p>
        </section>

        {/* 15. Routinemäßige Löschung und Sperrung von personenbezogenen Daten */}
        <section id="sec-loeschung">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            15. Routinemäßige Löschung und Sperrung von personenbezogenen Daten
          </h2>
          <p>
            Das Kriterium für die Dauer der Speicherung von personenbezogenen Daten ist die jeweilige
            gesetzliche Aufbewahrungsfrist. Entfällt der Speicherungszweck oder läuft eine vom
            Europäischen Richtlinien- und Verordnungsgeber oder einem anderen zuständigen Gesetzgeber
            vorgeschriebene Speicherfrist ab, werden die personenbezogenen Daten routinemäßig und
            entsprechend den gesetzlichen Vorschriften gesperrt oder gelöscht.
          </p>
        </section>

        {/* 16. Automatisierte Entscheidungsfindung */}
        <section id="sec-profiling">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            16. Automatisierte Entscheidungsfindung
          </h2>
          <p>
            Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling gemäß
            Art. 22 Abs. 1 und 4 DSGVO statt.
          </p>
        </section>

        {/* 17. Aktualität und Änderung dieser Datenschutzerklärung */}
        <section id="sec-stand">
          <h2 className="font-cinzel text-lg font-bold tracking-wider text-gold-primary uppercase mb-3">
            17. Aktualität und Änderung dieser Datenschutzerklärung
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
            Rechtslagen oder Änderungen unserer Datenverarbeitungen anzupassen. Es gilt die jeweils
            auf dieser Website veröffentlichte Fassung.
          </p>
        </section>

        {/* Datum */}
        <div className="pt-6 mt-6 border-t border-gold-secondary/15 text-xs text-cream-parchment/40 font-mono">
          Stand: Juli 2026
        </div>
      </div>
    </section>
  );
}
