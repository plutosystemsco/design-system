// The two development packages the downloads use ship no types; these are
// the calls `downloads.ts` makes, and no more.
declare module "fontkit" {
  export function create(buffer: Uint8Array): unknown;
}
declare module "wawoff2" {
  const wawoff2: { decompress(data: Uint8Array): Promise<Uint8Array> };
  export default wawoff2;
}
