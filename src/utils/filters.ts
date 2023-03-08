export default {
  authorizedUrl(urlString) {
    if (!urlString) {
      return urlString;
    }

    var url = new URL(urlString);
    url.searchParams.set("auth", import.meta.env.VITE_BMM_TOKEN);
    return url.toString();
  },
};
