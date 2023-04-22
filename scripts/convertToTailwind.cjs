const fs = require('fs').promises;

async function writeTailwindConfig(file, content) {
	// Simplifies class names so bg-info-default becomes bg-info
	content = content.replaceAll("default", "DEFAULT");

	await fs.writeFile(file, content, 'utf8');
}

async function writeColors(figmaInput) {
	const { colors } = figmaInput;

	for (const [colorKey] of Object.entries(colors)) {
		for (const [colorWeightKey, colorWeightToken] of Object.entries(colors[colorKey])) {
			colors[colorKey][colorWeightKey] = colorWeightToken.value;
		}
	}

	const content = `export const colors = ${JSON.stringify(colors, null, 2)};`

	await writeTailwindConfig('./src/tailwind/colors.ts', content);
}

async function writeTypography(figmaInput) {
	const globalTextColor = figmaInput.global.foreground;

	for (const [tokenKey, tokenValue] of Object.entries(globalTextColor)) {
		globalTextColor[tokenKey] = tokenValue.value;
	}

	const buttonForegroundColors = getButtonColors(figmaInput.button, 'foreground');

	const textColor = {
		...globalTextColor,
	}

	const content = `export const textColor = ${JSON.stringify(textColor, null, 2)};`

	await writeTailwindConfig('./src/tailwind/textColor.ts', content);
}

async function getFigmaInput() {
	let content = await fs.readFile('./temp/figma-transformed.json', 'utf-8');
	content = JSON.parse(content);
	return content;
}

async function main() {
	console.log("Building Tailwind config elements...")

	const figmaInput = await getFigmaInput();

	await writeColors(figmaInput);
	await writeTypography(figmaInput);

	return console.log("Finished building Tailwind config")
}

main()