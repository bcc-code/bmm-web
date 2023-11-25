const PREFIX = "bmm";
type NestedVariableObject = Record<string, string>;
type VariableObject = string | NestedVariableObject;

interface InputObject {
  [key: string]: VariableObject;
}

interface StyleConfig {
  cssString: string;
  tailwindColors: Record<string, any>;
}

// Helper function to convert color objects to CSS variables
function toCssVariables(obj: InputObject | VariableObject, prefix: string) {
  const lightCssVariables: Array<string> = [];
  const darkCssVariables: Array<string> = [];

  Object.entries(obj).forEach(([_key, value]) => {
    let key = _key;
    const vars = key.endsWith("-dark") ? darkCssVariables : lightCssVariables;
    if (vars === darkCssVariables) {
      key = key.replace("-dark", "");
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subVal]) => {
        const varName = `--${prefix}-${key}-${subKey}`;
        vars.push(`${varName}: ${subVal};`);
      });
    } else {
      const varName = `--${prefix}-${key}`;
      vars.push(`${varName}: ${value};`);
    }
  });

  return { lightCssVariables, darkCssVariables };
}

// Generate Tailwind Colors
function createTailwindColors(
  obj: InputObject | NestedVariableObject,
  prefix: string,
): Record<string, any> {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    // Ignore dark variants as they are handled by the CSS variables
    if (key.endsWith("-dark")) return;
    const value = obj[key];
    if (typeof value === "object") {
      result[key] = createTailwindColors(value, `${prefix}-${key}`);
    } else {
      result[key] = `var(--${prefix}-${key})`;
    }
  });
  return result;
}

export default function generateStylesAndConfig(
  input: InputObject,
): StyleConfig {
  // Generate CSS Variables
  const { lightCssVariables, darkCssVariables } = toCssVariables(input, PREFIX);

  const cssString = `
html {
	${lightCssVariables.join("\n\t")}
}

html.dark {
	${darkCssVariables.join("\n\t")}
}
  `;

  const tailwindColors = createTailwindColors(input, PREFIX);

  return { cssString, tailwindColors };
}
