/**
 * Your app's setting, which the person reaches before the first toast. The
 * root layout binds the toaster's `timers` to it:
 * `<Toaster timers={notifications.keep ? "off" : "on"} />`.
 */
export const notifications = $state({ keep: false });
