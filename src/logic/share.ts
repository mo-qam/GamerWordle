export interface SharePayload { text: string; }

export async function shareResult(payload: SharePayload) {
  try {
    if (navigator.share) {
      await navigator.share({ text: payload.text });
      return true;
    }
  } catch {}
  try {
    await navigator.clipboard.writeText(payload.text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = payload.text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
    return true;
  }
}
