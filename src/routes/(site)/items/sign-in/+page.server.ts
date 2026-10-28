import { readBuiltItem } from "#lib/server/built-item";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({ files: readBuiltItem("sign-in") });
