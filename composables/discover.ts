import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  DiscoverGetRequest,
  SectionHeaderModel,
  IAllDocumentModels,
} from "@bcc-code/bmm-sdk-fetch";

export type IDiscoverableGroup = {
  header: SectionHeaderModel | null;
  items: Exclude<IAllDocumentModels, SectionHeaderModel>[];
  useFlex: boolean;
};

export function useDiscover(requestParameters: DiscoverGetRequest) {
  return reactiveApi(
    useLazyAsyncData("discover", () =>
      new DiscoverApi().discoverGet(requestParameters),
    ),
  );
}
