// Minimal analytics abstraction; swap with GA/PLAUSIBLE later.
interface EventPayload { [k: string]: any }

type Transport = (name: string, payload?: EventPayload) => void;

let transport: Transport | null = null;

export function setAnalyticsTransport(fn: Transport) { transport = fn; }
export function track(name: string, payload?: EventPayload) { try { transport?.(name, payload); } catch {} }

// Example: integrate with Google Analytics gtag
// setAnalyticsTransport((name, payload) => { window.gtag?.('event', name, payload); });
