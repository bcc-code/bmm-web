export default function songbookName(apiName: string | null | undefined) {
  if (apiName === "herrens_veier") return "HV";
  if (apiName === "mandelblomsten") return "FMB";
  return apiName;
}
