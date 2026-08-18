# Europa-Radar-Pipeline

Erzeugt `data/europe-radar.json` für die Seite `/europa-talente`. Die Skripte
laufen mit blankem Node (keine Dependencies) und schreiben ihre Zwischenstände
als JSON in dasselbe Verzeichnis, aus dem sie gestartet werden.

## Warum es diese Pipeline gibt

Die Seite verspricht im Fußtext zwei Dinge, die von Hand nicht sauber
einzuhalten sind:

1. **Jeder Spieler ist mit mindestens zwei unabhängigen Quellen belegt.**
2. **Europlayers- und Hudl-Links erscheinen nur, wenn das Profil dort wirklich
   existiert und eindeutig diesem Spieler gehört.**

Punkt 2 ist der eigentliche Grund für den Aufwand. Hudl hat rund 4,7 Millionen
Profile; ein Namenstreffer bedeutet dort gar nichts (`michael-clark` liefert 67
Kandidaten). Auch Europlayers hat Dubletten – dort gibt es einen zweiten Tyler
Walker, der bei Benedictine spielt und nicht bei Montana Western. Beide Quellen
werden deshalb nach dem Namenstreffer gegen harte Merkmale geprüft.

## Reihenfolge

```bash
# 1. Rohdaten holen (siehe Quellen-URLs in den jeweiligen Skripten)
#    ap_*.html, afca_d2.html, afca_d3.html, naia_vsn.html, d3_direct.html, little.wiki

# 2. Auswahlteams parsen
node parse-ap.mjs        # AP All-America D2/D3/NAIA -> ap-allamerica-2025.json
node parse-afca.mjs      # AFCA Coaches D2/D3       -> afca-allamerica-2025.json
node parse-naia.mjs      # AFCA NAIA                -> naia-afca-2025.json
node parse-d3.mjs        # D3football.com           -> d3football-allamerica-2025.json
node parse-little.mjs    # Wikipedia-Tabelle        -> little-all-america-2025.json

# 3. Zusammenführen und Zwei-Quellen-Regel anwenden
node merge.mjs           # -> pool-2plus.json (veröffentlichbar), pool-single.json (nicht)

# 4. Profil-Abgleich
node crawl-europlayers.mjs   # ~420 Seiten, langsam (15-27 s/Seite) -> europlayers-index.json
node verify-europlayers.mjs  # prüft Team/Position/Maße             -> europlayers-matched.json
node crawl-hudl.mjs          # 2911 Sitemaps                        -> hudl-candidates.json
node verify-hudl.mjs         # prüft Hochschule in og:description   -> hudl-matched.json

# 5. Datei für die Seite bauen
node build-radar.mjs     # -> europe-radar.json  (nach data/ kopieren)
```

## Fallstricke, die schon Daten kaputtgemacht haben

- **AP-Artikel:** Die Abschnittsüberschriften stehen im Körper teils als leeres
  `<h2></h2>`, und ein Promo-Modul schiebt ein unsauber geschachteltes `<p>`
  mitten in die Liste. Deshalb wird an den *öffnenden* Tags tokenisiert und
  `<script>` vorher entfernt – sonst landet Werbe-JavaScript in der Hometown.
- **Feldreihenfolge** in den AP-Zeilen variiert (`Name, School, class, …` vs.
  `Name, class, School`), daher wird das Class-Token gesucht statt fix indiziert.
- **Namensvarianten** zwischen den Quellen (Ryan/Ryne Buttz, Scherecke/Schernecke).
  `merge.mjs` führt sie nur zusammen, wenn zusätzlich Position oder Schule passt.
- **Europlayers** liefert sporadisch HTTP 500. Fehlgeschlagene Seiten müssen
  nachgeholt werden, sonst fehlen ~50 Profile pro Seite im Index.

## Instagram

Bewusst leer. Weder Hudl noch Europlayers noch die College-Bios geben persönliche
Instagram-Accounts öffentlich preis; auf der Ferris-State-Bio verlinkt nur das
STUNT-Team seinen Account. Handles zu raten würde die Regel „nur anzeigen, was
belegt ist" brechen. Wenn eine belastbare Quelle auftaucht, ist das Feld
`instagram` in `EuropeRadarPlayer` bereits vorhanden und wird von der UI
gerendert.
