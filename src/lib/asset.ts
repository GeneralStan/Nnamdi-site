/**
 * Path to a file in /public, prefixed with the site's base path.
 *
 * On GitHub Pages the site lives under /Nnamdi-site, and with a static
 * export `next/image` does not add the base path to string sources itself.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
