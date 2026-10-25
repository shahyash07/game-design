type Props = Record<string, string | number | boolean>;

declare global {
  interface Window { posthog?: { capture: (event: string, props?: Props) => void } }
}

/** No-op until Lovable's PostHog connector defines window.posthog; analytics must never break play. */
export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.posthog?.capture(event, props);
  } catch {
    /* ignore */
  }
}
