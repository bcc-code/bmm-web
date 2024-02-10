export default function formatTime(duration: number) {
  return !Number.isFinite(duration)
    ? "--:--"
    : `${`${Math.floor(duration / 60)}`.padStart(2, "0")}:${`${Math.floor(
        duration % 60,
      )}`.padStart(2, "0")}`;
}
