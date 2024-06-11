export default function parseLink(link: string) {
  const url = new URL(link);
  if (
    url.origin === window.location.origin ||
    url.origin === `https://${config.websiteDomain}` ||
    url.origin === `https://${config.outdatedWebsiteDomain}`
  ) {
    // We remove the hostname so that we use SPA links (without full page refresh)
    return url.pathname + url.search + url.hash;
  }
  return link;
}
