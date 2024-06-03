export default function parseLink(link: string) {
  if (
    link.startsWith(window.location.origin) ||
    link.startsWith("https://bmm.bcc.media") ||
    link.startsWith("https://bmm.brunstad.org")
  ) {
    const url = new URL(link);
    // We remove the hostname so that we use SPA links (without full page refresh)
    return url.pathname + url.search + url.hash;
  }
  return link;
}
