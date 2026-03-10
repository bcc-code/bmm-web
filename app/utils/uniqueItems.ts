import type { TrackModelContributorRelation } from "@bcc-code/bmm-sdk-fetch";

export default function uniqueItems(
  contributors: TrackModelContributorRelation[],
) {
  return contributors.filter(
    (x, index) => contributors.findIndex((y) => y.id === x.id) === index,
  );
}
