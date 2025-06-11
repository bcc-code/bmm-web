// eslint-disable-next-line import/prefer-default-export
export function titleCase(input: string) {
	return input
		.toLowerCase()
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(" ");
}