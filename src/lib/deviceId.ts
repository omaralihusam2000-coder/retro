const KEY = "retro-device-id";

/**
 * A random per-browser id used only to stop the same browser from
 * double-upvoting or double-marking "played". Not a real identity.
 */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}
