import type { ServerLoadEvent } from "@sveltejs/kit";

/**
 * Reads the sidebar's cookie, which the provider writes on every toggle and
 * never reads, so the first paint is right. Under prerender there is no
 * cookie and the sidebar opens.
 */
export const load = ({ cookies }: ServerLoadEvent) => ({
  sidebarOpen: cookies.get("sidebar_state") !== "false",
});
