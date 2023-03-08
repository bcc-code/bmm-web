export default {
    authorizedUrl(urlString) {
        if (!urlString) {
            return urlString;
        }

        const url = new URL(urlString);
        url.searchParams.set("auth", import.meta.env.BMM_TOKEN);
        return url.toString();
    }
}
