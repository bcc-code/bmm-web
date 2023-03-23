import { useAuth0 } from "@auth0/auth0-vue";
import {
  Configuration,
  PlaylistApi,
  PlaylistModel,
} from "@bcc-code/bmm-sdk-fetch";

export const list = async () => {
  const { getAccessTokenSilently } = useAuth0();

  const token = await getAccessTokenSilently();

  return new PlaylistApi(
    new Configuration({
      basePath: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "nb,en,zxx",
      },
    })
  ).playlistGet();
};

export const get = async (id: NonNullable<PlaylistModel["id"]>) => {
  const { getAccessTokenSilently } = useAuth0();

  const token = await getAccessTokenSilently();

  return new PlaylistApi(
    new Configuration({
      basePath: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "nb,en,zxx",
      },
    })
  ).playlistIdGet({ id });
};
