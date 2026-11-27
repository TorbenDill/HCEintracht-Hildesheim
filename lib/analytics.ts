// Reichweitenmessung mit Google Analytics 4 – strikt einwilligungsgebunden.
//
// Muster wie marketingberatung-dill.de:
// 1. „Consent Mode basic“: Vor einer aktiven Zustimmung wird NICHTS geladen und
//    nichts an Google gesendet (auch keine cookielosen Pings). Die Consent-Signale
//    werden nach der Zustimmung trotzdem gesetzt (erst default, dann update).
// 2. Google Tag Manager (Container GTM-TQML353L, Konto „Petersilien Marketing“)
//    wird erst nach der Zustimmung geladen. Der Container enthält nur den
//    Google-Tag für GA4 und einen Ereignis-Tag; Inhalt versioniert in
//    docs/gtm/GTM-TQML353L_import.json. Ereignisse gehen als dataLayer-Push raus.
// 3. Keine personenbezogenen Daten in Ereignissen (keine Notizen, keine
//    URL-Fragmente geteilter Boards), keine Werbefunktionen.
//
// Seitenaufrufe bei Client-Navigation (App Router) erfasst GA4 selbst über die
// „Optimierte Analyse“ (Browserverlauf-Änderungen) – deshalb kein manueller page_view.

export const GA4_ID = "G-KN2EWX85MB"; // Property 565934397, Stream 16424034373 (Konfiguration im GTM-Container)
export const GTM_ID = "GTM-TQML353L";

/** Fassung der Einwilligungsabfrage. Erhöhen, wenn sich Zweck oder Empfänger ändern. */
export const EINWILLIGUNG_FASSUNG = 1;
export const EINWILLIGUNG_KEY = "nds-einwilligung";

export type Einwilligung = { fassung: number; statistik: boolean; zeit: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __ndsAnalytics?: boolean;
  }
}

export function leseEinwilligung(): Einwilligung | null {
  try {
    const roh = localStorage.getItem(EINWILLIGUNG_KEY);
    if (!roh) return null;
    const e = JSON.parse(roh) as Einwilligung;
    return e.fassung === EINWILLIGUNG_FASSUNG ? e : null;
  } catch {
    return null;
  }
}

export function speichereEinwilligung(statistik: boolean) {
  const e: Einwilligung = { fassung: EINWILLIGUNG_FASSUNG, statistik, zeit: new Date().toISOString() };
  try {
    localStorage.setItem(EINWILLIGUNG_KEY, JSON.stringify(e));
  } catch {
    /* Speicher gesperrt: Entscheidung gilt nur für diese Seite */
  }
  window.dispatchEvent(new CustomEvent("nds-einwilligung", { detail: e }));
}

export function widerrufeEinwilligung() {
  try {
    localStorage.removeItem(EINWILLIGUNG_KEY);
  } catch {
    /* ignorieren */
  }
  // GA-Cookies dieser Domain entfernen, damit der Widerruf sofort greift.
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const domain of ["", location.hostname, "." + location.hostname.replace(/^www\./, "")]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? "; domain=" + domain : ""}`;
      }
    }
  }
  window.dispatchEvent(new CustomEvent("nds-einwilligung", { detail: null }));
}

/** Lädt den GTM-Container genau einmal – nur nach Zustimmung aufrufen. */
export function starteAnalytics() {
  if (typeof window === "undefined" || window.__ndsAnalytics) return;
  window.__ndsAnalytics = true;
  window.dataLayer = window.dataLayer || [];
  // gtag muss `arguments` pushen, nicht ein Array – so verlangt es gtag.js.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  const gtag = window.gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

/** Alle Ereignisparameter; je Push zurückgesetzt, damit nichts zum nächsten Ereignis „mitwandert“. */
const PARAMETER = ["aktion", "spieler", "ziel", "label"] as const;

/** Ereignis senden – ohne Einwilligung passiert nichts. */
export function track(name: string, parameter: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !window.__ndsAnalytics || !window.dataLayer) return;
  const leer = Object.fromEntries(PARAMETER.map((k) => [k, undefined]));
  window.dataLayer.push({ ...leer, ...parameter, event: name });
}
