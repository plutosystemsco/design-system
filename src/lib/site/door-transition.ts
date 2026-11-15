/**
 * The door transition's one piece of state: which door the visitor just
 * followed from the home page's map. The disc sets it on click; the (site)
 * layout's `onNavigate` takes it once, so a bar link or any other
 * navigation never starts a transition.
 */
import type { DoorId } from "./doors.ts";

let followed: DoorId | null = null;

export function followDoor(id: DoorId): void {
  followed = id;
}

export function takeDoor(): DoorId | null {
  const id = followed;
  followed = null;
  return id;
}
