/** Prefixes a public/ file path with the deploy base path (plain <a> tags don't get it automatically). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
