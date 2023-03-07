export default {
    authorizedUrl(url) {
        if (url && !url.includes("auth"))
            return `${url}&auth=${import.meta.env.VITE_BMM_TOKEN}`;
        return url;
    }
}