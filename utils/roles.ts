import type { Role, UserModel } from "@bcc-code/bmm-sdk-fetch";

function hasRole(user: UserModel, role: Role): boolean {
  return user.roles?.includes(role) === true;
}

export function isAdmin(user: UserModel): boolean {
  return hasRole(user, "ROLE_ADMINISTRATOR");
}
export function isDownloader(user: UserModel): boolean {
  return hasRole(user, "ROLE_DOWNLOADER") || isAdmin(user);
}
export function isUploader(user: UserModel): boolean {
  return (
    hasRole(user, "ROLE_TRACK_MANAGER") ||
    hasRole(user, "ROLE_ALBUM_MANAGER") ||
    hasRole(user, "ROLE_PODCAST_MANAGER") ||
    hasRole(user, "ROLE_CONTRIBUTOR_MANAGER") ||
    isAdmin(user)
  );
}

export function isTranscriptionManager(user: UserModel): boolean {
  return hasRole(user, "ROLE_TRANSCRIPTION_MANAGER") || isAdmin(user);
}
