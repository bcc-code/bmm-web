import {
  DiscoverApi,
  DiscoverGetRequest,
  IDiscoverable,
  SectionHeaderModel,
} from "@bcc-code/bmm-sdk-fetch";

export type IDiscoverableGroup = {
  header: SectionHeaderModel | null;
  items: Exclude<IDiscoverable, SectionHeaderModel>[];
};

export function useDiscover(requestParameters: DiscoverGetRequest) {
  return reactiveApi(
    useLazyAsyncData("discover", () =>
      new DiscoverApi().discoverGet(requestParameters).then((d) => {
        let currentSection: IDiscoverableGroup["items"] = [];
        const result: IDiscoverableGroup[] = [];
        d.forEach((el) => {
          if (el.type === "section_header") {
            currentSection = [];
            result.push({
              header: el,
              items: currentSection,
            });
          } else {
            currentSection.push(el);
          }
        });
        return result;
      })
    )
  );
}
