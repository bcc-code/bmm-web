export default function authorizedUrl(urlString: string, token?: string) {
  if (!token) {
    return urlString;
  }

  const url = new URL(urlString);
  url.searchParams.set("auth", `Bearer ${token}`);
  return url.toString();
}
