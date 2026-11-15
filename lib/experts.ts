import podcast from "@/data/podcast-episodes.json";

/**
 * Die Experten hinter den Einschätzungen auf der Seite.
 * Forstner liefert die wörtlichen Statements (`forstner_statement`),
 * beide äußern sich wöchentlich im Footballquark-Podcast
 * („Die Stars von Morgen“) – diese Einschätzungen laufen als
 * `podcast_stimmen` an den Spielerprofilen.
 */
export type ExpertId = "forstner" | "leinweber";

export type Expert = {
  id: ExpertId;
  name: string;
  rolle: string;
  kurz: string;
};

export const EXPERTS: Record<ExpertId, Expert> = {
  forstner: {
    id: "forstner",
    name: "Philipp Forstner",
    rolle: "Scout · Forstner Scouting · Kommentator bei RTL",
    kurz:
      "Verantwortet die Scouting-Einschätzungen und die namentlich gekennzeichneten Statements auf den Spielerprofilen.",
  },
  leinweber: {
    id: "leinweber",
    name: "Lorenz Leinweber",
    rolle: "Director of Scouting · Frankfurt Galaxy",
    kurz:
      "Director of Scouting der Frankfurt Galaxy; analysiert mit Philipp Forstner jede Woche College Football und die Prospects des nächsten NFL Drafts im Footballquark-Podcast „Die Stars von Morgen“.",
  },
};

export type PodcastEpisode = {
  datum: string;
  titel: string;
  spotify: string | null;
  audio?: string;
  geprueft?: boolean;
};

export type PodcastStimme = {
  /** Datum der Folge (YYYY-MM-DD) – Schlüssel in data/podcast-episodes.json */
  folge: string;
  /** Zeitmarke in der Folge, z. B. "23:40" */
  minute?: string | null;
  /** Wer die Einschätzung abgibt; "beide" = gemeinsame Einordnung */
  sprecher: ExpertId | "beide";
  /** Sinngemäße Zusammenfassung der Einschätzung (keine wörtlichen Zitate) */
  text: string;
};

export const PODCAST = {
  name: podcast.podcast,
  reihe: podcast.reihe,
  showUrl: podcast.show_url,
};

const EPISODES = new Map<string, PodcastEpisode>(
  (podcast.folgen as PodcastEpisode[]).map((f) => [f.datum, f])
);

export function getEpisodes(): PodcastEpisode[] {
  return [...EPISODES.values()].sort((a, b) => b.datum.localeCompare(a.datum));
}

export function getEpisode(datum: string): PodcastEpisode | undefined {
  return EPISODES.get(datum);
}

/** Link zur Folge; ohne bekannte Spotify-ID die Show-Seite. */
export function episodeUrl(datum: string): string {
  return EPISODES.get(datum)?.spotify ?? PODCAST.showUrl;
}

/** Folgentitel ohne den Reihen-Zusatz, für kompakte Anzeige. */
export function episodeShortTitle(datum: string): string {
  const t = EPISODES.get(datum)?.titel ?? "";
  return t.replace(/\s*-\s*Die Stars von Morgen.*$/, "").trim();
}

export function speakerLabel(s: PodcastStimme["sprecher"]): string {
  return s === "beide"
    ? `${EXPERTS.forstner.name} & ${EXPERTS.leinweber.name}`
    : EXPERTS[s].name;
}

export function formatDateDe(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
