export default {
  authorizedUrl(urlString: string | null | undefined) {
    if (!urlString) {
      return "";
    }

    const url = new URL(urlString);
    url.searchParams.set("auth", import.meta.env.VITE_BMM_TOKEN);
    return url.toString();
  },
};
