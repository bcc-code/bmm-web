import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackIdTranscriptionGetRequest } from "@bcc-code/bmm-sdk-fetch";

export function useTrackTranscription(
	options: TrackIdTranscriptionGetRequest,
) {
	return useLazyAsyncData(`transcription-${options.id}`, () =>
		new TrackApi().trackIdTranscriptionGet(options),
		{ immediate: false }
	);
}
