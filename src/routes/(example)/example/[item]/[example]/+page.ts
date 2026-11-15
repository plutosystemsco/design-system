import { exampleModule } from "#lib/site/examples";
import type { PageLoad } from "./$types";

/** The one example this view shows, its module loaded alone. */
export const load: PageLoad = async ({ params, data }) => {
  const module = await exampleModule(params.item, params.example);
  return { ...data, View: module?.default, title: module?.meta.title ?? "" };
};
