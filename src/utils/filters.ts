export default {
    authorizedUrl(urlString) {
        if (!urlString) {
            return urlString;
        }

        const url = new URL(urlString);
        url.searchParams.set("auth", "Bearer " + localStorage.getItem("token"));
        return url.toString();
    }
}
