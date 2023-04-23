const fs = require('fs').promises;

const shouldNotHaveSuffix = theme => ['light', 'global'].includes(theme)

async function writeTailwindConfig(file, content) {
	// Simplifies class names so bg-info-default becomes bg-info
	content = content.replaceAll("default", "DEFAULT");

	await fs.writeFile(file, content, 'utf8');
}

async function writeColors(figmaInput) {
	const { color } = figmaInput;
	const transformedColors = {}

	for (const [theme, themeValue] of Object.entries(color)) {
		for (const [colorKey, colorValue] of Object.entries(themeValue)) {
			const suffixedKey = shouldNotHaveSuffix(theme) ? colorKey : `${colorKey}-${theme}`

			if (!colorValue.value) {
				transformedColors[suffixedKey] ||= {}

				for (const [innerColorWeight, innerColorValue] of Object.entries(colorValue)) {
					transformedColors[suffixedKey][innerColorWeight] = innerColorValue.value
				}
			} else {
				transformedColors[suffixedKey] = colorValue.value
			}
		}
	}


	const content = `export const colors = ${JSON.stringify(transformedColors, null, 2)};`
	await writeTailwindConfig('./tailwind/colors.ts', content);
}

async function getFigmaInput() {
	let content = await fs.readFile('./assets/design-tokens/tokens.json', 'utf-8');
	content = JSON.parse(content);
	return content;
}

async function main() {
	console.log("Building Tailwind config elements...")

	const figmaInput = await getFigmaInput();

	await writeColors(figmaInput);

	return console.log("Finished building Tailwind config")
}

main()