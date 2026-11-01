/** Who a turn is from, or a line that is not a turn (a "Stopped" marker). */
export type ChatRole = "user" | "assistant" | "marker";

/** One message in a conversation. */
export type ChatMessage = { id: string; role: ChatRole; text: string };

/** The chat's state: the Vercel AI SDK's four names, as the composer takes them. */
export type ChatStatus = "ready" | "submitted" | "streaming" | "error";
