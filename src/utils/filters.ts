export default {
  authorizedUrl(urlString: string) {
    if (!urlString) {
      return urlString;
    }

    const url = new URL(urlString);
    url.searchParams.set("auth", `Bearer ${localStorage.getItem("token")}`);
    return url.toString();
  },
};
