/** Who a turn is from, or a line that is not a turn (a "Stopped" marker). */
export type ChatRole = "user" | "assistant" | "marker";

/** One message in a conversation. */
export type ChatMessage = {
  /** A stable id, unique in the conversation. */
  id: string;
  /** Who it is from, or `marker` for a line that is not a turn. */
  role: ChatRole;
  /** The message's text, with fenced code as Markdown writes it. */
  text: string;
};

/** The chat's state: the Vercel AI SDK's four names, as the composer takes them. */
export type ChatStatus = "ready" | "submitted" | "streaming" | "error";
