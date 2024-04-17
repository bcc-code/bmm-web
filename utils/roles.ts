import type { UserModel } from "@bcc-code/bmm-sdk-fetch";

export function isAdmin(user: UserModel): boolean {
  return user.roles?.includes("ROLE_ADMINISTRATOR") === true;
}
export function isDownloader(user: UserModel): boolean {
  return user.roles?.includes("ROLE_DOWNLOADER") === true || isAdmin(user);
}
