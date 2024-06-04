export default function parseLink(link: string) {
  const url = new URL(link);
  if (
    url.origin === window.location.origin ||
    url.origin === "https://bmm.bcc.media" ||
    url.origin === "https://bmm.brunstad.org"
  ) {
    // We remove the hostname so that we use SPA links (without full page refresh)
    return url.pathname + url.search + url.hash;
  }
  return link;
}
