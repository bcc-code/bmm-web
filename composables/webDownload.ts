import { useAuth0 } from "@auth0/auth0-vue";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

function downloadTrack(track: TrackModel, accessToken: string) {
  const file = defaultFileForTrack(track);
  const url = file?.url;
  if (file && url) {
    const authUrl = authorizedUrl(url, accessToken);
    window.location.href = `${authUrl}&download=true`;
  }
}

export type DownloadResult = "no-permission" | "downloaded";
export function useWebDownload() {
  const { getAccessTokenSilently } = useAuth0();
  const currentUser = useCurrentUser();

  return {
    download: async (track: TrackModel): Promise<DownloadResult> => {
      const user = (await currentUser).data.value;
      if (!user || (track.subtype === "speech" && !isDownloader(user))) {
        return "no-permission";
      }
      const accessToken = await getAccessTokenSilently();
      downloadTrack(track, accessToken);
      return "downloaded";
    },
  };
}
