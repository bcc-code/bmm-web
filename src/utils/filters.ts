export default {
  authorizedUrl(urlString: string, token?: string) {
    if (!urlString) {
      return urlString;
    }

    const url = new URL(urlString);
    url.searchParams.set("auth", `Bearer ${token}`);
    return url.toString();
  },
};
