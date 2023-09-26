export default function calculateAge(birthdate: string | undefined) {
  if (birthdate === undefined) return undefined;
  const date = new Date(birthdate);
  // We don't want the current age, just the age at the end of the year.
  return new Date().getFullYear() - date.getFullYear();
}
