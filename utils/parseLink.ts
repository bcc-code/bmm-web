export default function parseLink(link: string) {
  const url = new URL(link);
  // We remove the hostname so that we use SPA links (without full page refresh)
  return url.pathname + url.search + url.hash;
}
