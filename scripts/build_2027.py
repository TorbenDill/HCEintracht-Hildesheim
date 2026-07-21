#!/usr/bin/env python3
"""Build data/data.json + data/mockdraft.json for the 2027 NFL Draft board.

Input: /tmp/scripts/research2027.json  (merged research data, hand-curated)
Structure:
{
  "players": [
    {
      "name": "...", "position": "QB", "school": "...",
      "class_year": "Junior", "height": "6'2\"", "weight": "225 lbs",
      "overall_rank": 1 | null,       # consensus big-board rank
      "pos_rank": 1,
      "projection": "Top-5" | "Runde 1" | "Runde 2" | "Day 2" | "Day 3",
      "round": 1,                      # numeric projected round 1..7
      "report_core_de": "1-3 individuelle deutsche Sätze zum Spieler",
      "best_case": "NFL-Spieler-Vergleich (best case)" | null,   # optional override
      "worst_case": "..." | null,                                # optional override
      "forstner": "..." | null,                                  # optional override
      "sources": ["espn.com", "..."]
    }, ...
  ],
  "mockdraft": [
    {"pick": 1, "team": "...", "teamAbbr": "...", "player": "...",
     "position": "QB", "college": "...", "reason_de": "..."}
  ]
}
"""
import json
import sys

RESEARCH = "data/research2027.json"

POSITION_LABEL_DE = {
    "QB": "Quarterback", "RB": "Running Back", "WR": "Wide Receiver",
    "TE": "Tight End", "OT": "Offensive Tackle", "IOL": "Interior O-Liner",
    "G": "Guard", "C": "Center", "EDGE": "Edge Rusher", "DT": "Defensive Tackle",
    "LB": "Linebacker", "CB": "Cornerback", "S": "Safety",
    "K": "Kicker", "P": "Punter", "LS": "Long Snapper",
}

PIKTOGRAMME = {
    "QB": {1: ["Spielintelligenz", "Armstärke", "Antizipation"],
           2: ["Pocket Presence", "Genauigkeit", "Entscheidungsfindung"],
           3: ["Mobilität", "Armstärke", "Lernfähigkeit"],
           4: ["Arbeitsmoral", "Athletik", "Mechanics"],
           5: ["Toughness", "Developmental", "Leadership"]},
    "RB": {1: ["Explosivität", "Vision", "Contact Balance"],
           2: ["Receiving", "Elusiveness", "Speed"],
           3: ["Power", "Short Yardage", "Pass Protection"],
           4: ["Motor", "Versatilität", "Spezialteams"],
           5: ["Physikalität", "Backup-Material", "Durability"]},
    "WR": {1: ["Route Running", "Separation", "Hände"],
           2: ["Body Control", "Red Zone", "YAC"],
           3: ["Speed", "Release", "Contested Catches"],
           4: ["Slot-Profil", "Blocking", "Special Teams"],
           5: ["Deep Threat", "Developmental", "Gadget"]},
    "TE": {1: ["Receiving", "Athletik", "Versatilität"],
           2: ["Blocking", "Catch Radius", "Red Zone"],
           3: ["Physikalität", "In-Line", "H-Back"],
           4: ["Special Teams", "Developmental", "Move-TE"],
           5: ["Blocking TE", "Depth", "Short Yardage"]},
    "OT": {1: ["Pass Protection", "Fußarbeit", "Körperkontrolle"],
           2: ["Länge", "Power", "Anker"],
           3: ["Zone Blocking", "Athletik", "Technik"],
           4: ["Swing-Tackle", "Developmental", "Motor"],
           5: ["Depth", "Power", "Versatility"]},
    "IOL": {1: ["Power", "Handtechnik", "Line Calls"],
            2: ["Pass Protection", "Second Level", "Balance"],
            3: ["Run Blocking", "Zone Scheme", "Technik"],
            4: ["Toughness", "IQ", "Depth"],
            5: ["Spec. Scheme", "Developmental", "Backup"]},
    "EDGE": {1: ["Burst", "Bend", "Pass Rush Moves"],
             2: ["Power Rush", "Länge", "Run Defense"],
             3: ["Motor", "Hands", "Drop Coverage"],
             4: ["Depth", "Special Teams", "Developmental"],
             5: ["Rotation", "Motor", "Versatility"]},
    "DT": {1: ["Power", "Quickness", "Pad Level"],
           2: ["Hand Fighting", "Anker", "Pass Rush"],
           3: ["Motor", "Run Stuffer", "Gap Shooter"],
           4: ["Depth", "Rotation", "Toughness"],
           5: ["Nose Tackle", "Backup", "Developmental"]},
    "LB": {1: ["Sideline-to-Sideline", "Instinkte", "Tackling"],
           2: ["Coverage", "Blitz", "Physikalität"],
           3: ["Run Stop", "Key & Read", "Vielseitigkeit"],
           4: ["Special Teams", "Motor", "Depth"],
           5: ["Backup", "Core Four ST", "Toughness"]},
    "CB": {1: ["Press Coverage", "Speed", "Ball Skills"],
           2: ["Zone IQ", "Recovery", "Physikalität"],
           3: ["Tackling", "Route Recognition", "Slot"],
           4: ["Special Teams", "Developmental", "Depth"],
           5: ["Backup", "Motor", "Press Only"]},
    "S": {1: ["Range", "Ball Skills", "Football IQ"],
          2: ["Tackling", "Box Presence", "Coverage"],
          3: ["Vielseitigkeit", "Communication", "Special Teams"],
          4: ["Depth", "Developmental", "Motor"],
          5: ["Backup", "ST Core", "Physikalität"]},
}

NFL_COMPS = {
    "QB": {1: ("Patrick Mahomes (Chiefs) – Franchise-QB mit Elite-Tools",
               "Zach Wilson – früher 1st-Rounder, der nie seine Form findet"),
           2: ("Dak Prescott (Cowboys) – solider Franchise-Starter",
               "Mac Jones – limitiert, wird zum Journeyman"),
           3: ("Kirk Cousins – konstanter Starter mit Grenzen nach oben",
               "Kenny Pickett – Backup-Level in der NFL"),
           4: ("Brock Purdy (49ers) – System-QB, der überraschen kann",
               "Davis Mills – Spot-Starter in Notlagen"),
           5: ("Gardner Minshew – solider Backup über Jahre",
               "Practice-Squad-Stamm mit NFL-Body")},
    "RB": {1: ("Christian McCaffrey (49ers) – Three-Down-Weapon",
               "Jonathan Taylor (Post-Injury) – Explosivität schwindet früh"),
           2: ("Derrick Henry (Ravens) – Workhorse mit Goal-Line-Profil",
               "Cam Akers – kann seine Rolle nie halten"),
           3: ("James Cook (Bills) – Committee-RB mit Receiving-Upside",
               "Kenneth Gainwell – reiner 3rd-Down-Back"),
           4: ("Jerome Ford – brauchbarer RB2 in einer Rotation",
               "Journeyman ohne feste Rolle"),
           5: ("Special-Teams-RB mit Kick-Return-Rolle",
               "Camp-Body für das Practice Squad")},
    "WR": {1: ("Ja'Marr Chase (Bengals) – Elite-#1-Receiver",
               "Kadarius Toney – Talent ohne Polish, verglüht früh"),
           2: ("DJ Moore (Bears) – solider Starter und Chain-Mover",
               "Quez Watkins – nie mehr als WR4"),
           3: ("Darnell Mooney – Komplementär-Receiver mit Big Plays",
               "Profi-Body ohne Produktions-Sprung"),
           4: ("Jalen Tolbert – WR3 mit Deep-Ball-Rolle",
               "Skyy Moore – Day-2-Pick ohne echte Rolle"),
           5: ("Speed-Profil für Spezialrollen",
               "Practice-Squad-Material")},
    "TE": {1: ("Brock Bowers (Raiders) – Dual-Threat-TE1 ab Tag 1",
               "O.J. Howard – Tools ohne Produktion"),
           2: ("Cole Kmet (Bears) – solider Starter",
               "Hayden Hurst – TE2 mit gelegentlichen Starts"),
           3: ("Tyler Higbee – verlässliche In-Line-Option",
               "unauffälliger Depth-TE"),
           4: ("Foster Moreau – Blocking-TE mit Rolle",
               "Backup-Material"),
           5: ("Reiner Depth-TE", "TE3-Profil für Camp-Battles")},
    "OT": {1: ("Penei Sewell (Lions) – Elite-Tackle mit Pro-Bowl-Ceiling",
               "Andre Dillard – 1st-Rounder, der kein Starter wird"),
           2: ("Rashawn Slater (Chargers) – langfristiger Starter",
               "muss nach innen wechseln, um Einfluss zu haben"),
           3: ("Swing-Tackle mit Starter-Potential",
               "jahrelanger Backup mit einzelnen Starts"),
           4: ("Rotationsspieler", "Day-3-Backup"),
           5: ("Developmental-Prospect", "Practice-Squad-Material")},
    "IOL": {1: ("Quenton Nelson (Colts) – Elite-Interior-Blocker",
                "solide, aber nie Pro-Bowl-Niveau"),
            2: ("Creed Humphrey (Chiefs) – Top-Center der Liga",
                "bleibt unter den Erwartungen"),
            3: ("langfristiger Starter im Zone-Scheme",
                "Day-3-Rotation"),
            4: ("Depth-Blocker mit Upside", "Camp-Body"),
            5: ("Developmental", "Training-Camp-Kandidat")},
    "EDGE": {1: ("Myles Garrett (Browns) – Elite-Pass-Rusher",
                 "Vernon Gholston – 1st-Rounder, Totalausfall"),
             2: ("Harold Landry III – Starter mit 10+-Sack-Potenzial",
                 "Rotationsspieler ohne Konstanz"),
             3: ("Rotations-Rusher mit Burst",
                 "Day-3-Rotation ohne echten Impact"),
             4: ("Depth-Rusher mit Situationsrolle", "Camp-Body"),
             5: ("Developmental", "Practice Squad")},
    "DT": {1: ("Aaron Donald (a.D.) – Generationstalent-Profil",
               "Jerry Tillery – 1st-Rounder ohne Produktion"),
           2: ("Dexter Lawrence (Giants) – Pro-Bowl-Anker",
               "Malik McDowell – Tools ohne Output"),
           3: ("Dalvin Tomlinson – solider Run-Stuffer",
               "Rotationsspieler"),
           4: ("Depth-DT", "Camp-Body"),
           5: ("Practice Squad", "Developmental")},
    "LB": {1: ("Fred Warner (49ers) – Elite-Off-Ball-LB",
               "gut, aber nie Pro-Bowl-Niveau"),
           2: ("Roquan Smith (Ravens) – Tackling-Machine",
               "solider Starter, kein Game-Changer"),
           3: ("langjähriger Starter/Backup", "Day-3-Rotation"),
           4: ("Core-Special-Teamer mit Backup-Rolle", "Camp-Body"),
           5: ("Depth", "Practice Squad")},
    "CB": {1: ("Patrick Surtain II (Broncos) – Elite-Shutdown-Corner",
               "Trevon Diggs – boom-or-bust mit hohen Picks"),
           2: ("Jaylon Johnson (Bears) – solider Außen-Starter",
               "limitiertes Ceiling"),
           3: ("Slot-Corner mit fester Rolle", "Rotationsspieler"),
           4: ("Depth-Corner", "Special-Teams-only"),
           5: ("Camp-Body", "Practice Squad")},
    "S": {1: ("Derwin James (Chargers) – Swiss-Army-Knife der Defense",
              "Karl Joseph – 1st-Rounder ohne Wirkung"),
          2: ("Justin Simmons – langjähriger Starter",
              "Rolle unklar, flackert"),
          3: ("verlässlicher Starter/Backup", "Rotationsspieler"),
          4: ("Depth-Safety", "Special-Teams"),
          5: ("Camp-Body", "Practice Squad")},
}

POSITION_STRENGTHS = {
    "QB": "Armstärke, Pocket-Präsenz und die Fähigkeit, Secondaries unter Druck zu lesen",
    "RB": "Vision, Contact Balance und ein gesunder Mix aus Power und Elusiveness",
    "WR": "Route-Running, Release von der Line und zuverlässige Hände in umkämpften Situationen",
    "TE": "Catch Radius, Athletik in der Mittelzone und Verlässlichkeit als In-Line-Blocker",
    "OT": "Fußarbeit im Pass-Set, Länge im Punch und eine stabile Anker-Basis",
    "IOL": "Power an der Line of Scrimmage, sauberes Hand-Placement und Beweglichkeit im Laufspiel",
    "EDGE": "Burst aus dem Stand, Bend um den Corner und ein wachsendes Pass-Rush-Move-Set",
    "DT": "Pad Level, Hand Fighting und die Kraft, Double-Teams zu resetten",
    "LB": "Instinkte, Sideline-to-Sideline-Range und klare Physikalität im Tackling",
    "CB": "Press-Coverage an der Line, Hüftbeweglichkeit in der Transition und ein Gefühl für den Ballpunkt",
    "S": "Range im Deep-Third, Ball Skills und eine saubere Tackling-Form im Open Field",
}

POSITION_QUESTIONS = {
    "QB": "Konstanz in der Mechanik, Entscheidungsfindung unter Druck und das Tempo bei den Progressions",
    "RB": "Pass-Protection, das Receiving-Profil aus dem Backfield und die langfristige Belastbarkeit",
    "WR": "Separation gegen NFL-Press-Coverage sowie Zuverlässigkeit im Blocking",
    "TE": "In-Line-Blocking gegen NFL-Defensive-Ends und die Konstanz bei Contested Catches",
    "OT": "Konstanz gegen lange Edge-Rusher und das Halten des Pad-Levels in tiefen Sets",
    "IOL": "Pass-Protection gegen Interior-Pressure und die Beweglichkeit im Second Level",
    "EDGE": "Run Defense als Edge-Setter und die Entwicklung eines konstanten Counter-Moves",
    "DT": "das Pass-Rush-Upside als 3-Technique und die Gap-Integrity über 50+ Snaps",
    "LB": "Coverage-Drops in der Matchup-Zone und das Verhalten im Stack gegen NFL-Guards",
    "CB": "Physikalität im Run-Support und die Körperkontrolle bei schnellen Routen",
    "S": "Man-Coverage gegen Slot-Receiver und die Winkel als letzte Verteidigungslinie",
}

def get_bucket(d, pos, rnd):
    b = d.get(pos, {})
    if not b:
        return None
    key = min(max(rnd or 5, 1), 5)
    return b.get(key, b.get(5))

def projection_de(p):
    return p.get("projection") or ("Runde %d" % p["round"] if p.get("round") else "Day 3")

def build_report(p):
    name = p["name"]
    pos = p["position"]
    school = p.get("school", "")
    label = POSITION_LABEL_DE.get(pos, pos)
    core = p.get("report_core_de", "").strip()
    strengths = POSITION_STRENGTHS.get(pos, "seinen positionsspezifischen Werkzeugen")
    questions = POSITION_QUESTIONS.get(pos, "der Konstanz auf Snap-Ebene")
    proj = projection_de(p)

    facts = []
    if p.get("height"):
        facts.append(p["height"])
    if p.get("weight"):
        facts.append(p["weight"])
    if p.get("class_year"):
        facts.append(p["class_year"])
    facts_s = " · ".join(facts)

    intro = f"{name} ({label}, {school}"
    if facts_s:
        intro += f", {facts_s}"
    intro += f") wird für den NFL Draft 2027 aktuell mit der Projektion „{proj}“ geführt."

    parts = [intro]
    if core:
        parts.append(core)
    parts.append(
        f"Positionsprofil: Auf {pos} zählen vor allem {strengths}. "
        f"Die offenen Fragen für die Saison 2026 betreffen {questions} – "
        f"dort entscheidet sich, ob sich seine Draft-Aktie weiter nach oben bewegt."
    )
    parts.append(
        "Hinweis: Alle Bewertungen basieren auf dem Stand vor der College-Saison 2026 "
        "und werden im 14-Tage-Rhythmus mit den aktuellen Consensus-Boards abgeglichen."
    )
    return " ".join(parts)

def build_forstner(p):
    if p.get("forstner"):
        return p["forstner"]
    rnd = p.get("round")
    name = p["name"]
    if rnd == 1:
        return f"{name} ist für mich ein sicherer Erstrundenpick 2027 – dieses Profil plane ich fest ein."
    if rnd == 2:
        return f"{name} gehört auf jedes Top-60-Board. Mit einer starken Saison 2026 ist sogar Runde 1 drin."
    if rnd == 3:
        return f"{name} ist ein klassischer Day-2-Value – bei einem Fall in Runde 3 würde ich sofort zuschlagen."
    return None

def main():
    with open(RESEARCH) as f:
        research = json.load(f)

    out = []
    pos_counters = {}
    for p in research["players"]:
        pos = p["position"]
        pos_counters[pos] = pos_counters.get(pos, 0) + 1
        pos_rank = p.get("pos_rank") or pos_counters[pos]
        rnd = p.get("round")
        pikt = get_bucket(PIKTOGRAMME, pos, rnd) or []
        comps = get_bucket(NFL_COMPS, pos, rnd) or (None, None)
        best = p.get("best_case") or comps[0]
        worst = p.get("worst_case") or comps[1]

        out.append({
            "name": p["name"],
            "position": pos,
            "college": p.get("school", ""),
            "height": p.get("height") or "",
            "weight": p.get("weight") or "",
            "ranking_pos": pos_rank,
            "ranking_overall": p.get("overall_rank"),
            # Bevorzugt individuell geschriebene Texte; nur wenn keine
            # vorhanden sind, greift der generische Fallback-Generator.
            "forstner_statement": p.get("forstner") or build_forstner(p),
            "piktogramme": list(pikt),
            "scouting_report_de": p.get("report_de") or build_report(p),
            "best_case_nfl": best,
            "worst_case_nfl": worst,
            "class_year": p.get("class_year"),
            "projection": projection_de(p),
            "sources": p.get("sources", []),
        })

    out.sort(key=lambda x: (
        x["ranking_overall"] if x["ranking_overall"] is not None else 10_000,
        x["position"], x["ranking_pos"],
    ))

    # Riser/Faller: die ALTEN Overall-Ranks (aus der bisherigen data.json)
    # als "previous" sichern, bevor die neue geschrieben wird. So lassen sich
    # Bewegungen seit dem letzten Update berechnen.
    def slugify(name):
        # identisch zu getPlayerSlug: lower, Leerraum -> "-", dann . und ' entfernen
        s = "-".join(name.lower().split())
        return s.replace(".", "").replace("'", "")

    previous = {}
    try:
        with open("data/data.json") as f:
            for p in json.load(f):
                if p.get("ranking_overall") is not None:
                    previous[slugify(p["name"])] = p["ranking_overall"]
    except (FileNotFoundError, ValueError):
        pass
    with open("data/rank-history.json", "w") as f:
        json.dump({"previous": previous}, f, ensure_ascii=False, indent=2)

    with open("data/data.json", "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    with open("data/mockdraft.json", "w") as f:
        json.dump(research["mockdraft"], f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(out)} players to data/data.json")
    print(f"Wrote {len(research['mockdraft'])} picks to data/mockdraft.json")
    print("Positions:", sorted({p['position'] for p in out}))
    ranked = sum(1 for p in out if p["ranking_overall"] is not None)
    print(f"With overall rank: {ranked}")
    # sanity: mock draft players must exist in data
    names = {p["name"] for p in out}
    missing = [m["player"] for m in research["mockdraft"] if m["player"] not in names]
    if missing:
        print("WARNING mockdraft players missing from board:", missing)

if __name__ == "__main__":
    main()
