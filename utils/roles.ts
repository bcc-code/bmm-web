import { Role } from "@bcc-code/bmm-sdk-fetch";
import type { UserModel } from "@bcc-code/bmm-sdk-fetch";

function hasRole(user: UserModel, role: Role): boolean {
  return user?.roles?.includes(role) === true;
}

export function isAdmin(user: UserModel): boolean {
  return hasRole(user, Role.RoleAdministrator);
}
export function isDownloader(user: UserModel): boolean {
  return hasRole(user, Role.RoleDownloader) || isAdmin(user);
}
export function isUploader(user: UserModel): boolean {
  return (
    hasRole(user, Role.RoleTrackManager) ||
    hasRole(user, Role.RoleAlbumManager) ||
    hasRole(user, Role.RolePodcastManager) ||
    hasRole(user, Role.RoleContributorManager) ||
    isAdmin(user)
  );
}
export function isTrackManager(user: UserModel): boolean {
  return hasRole(user, Role.RoleTrackManager) || isAdmin(user);
}

export function isTranscriptionManager(user: UserModel): boolean {
  return hasRole(user, Role.RoleTranscriptionManager) || isAdmin(user);
}

export function isFraKaareDashboardViewer(user: UserModel): boolean {
  return hasRole(user, Role.RoleFrakaareDashboard) || isAdmin(user);
}

export function isLyricsManager(user: UserModel): boolean {
  return hasRole(user, Role.RoleLyricsManager) || isAdmin(user);
}

export function isHomeScreenManager(user: UserModel): boolean {
  return hasRole(user, Role.RoleHomeScreenManager) || isAdmin(user);
}
