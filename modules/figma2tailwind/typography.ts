interface TypographyValue {
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  fontSize: string;
  letterSpacing: string;
  paragraphSpacing?: string;
  paragraphIndent?: string;
  textCase?: string;
  textDecoration?: string;
}

interface TypographyData {
  [key: string]: {
    value: TypographyValue;
    type: string;
  };
}

interface TypographyStyles {
  [className: string]: {
    "font-size": string;
    "font-family": string;
    "font-weight": string;
    "font-style": string;
    "line-height"?: string;
    "letter-spacing"?: string;
    "text-decoration": string;
    "text-transform": string;
  };
}

export default function convertTypographyToCSS(typographyData: {
  [key: string]: TypographyData;
}): TypographyStyles {
  const cssStyles: TypographyStyles = {};

  // Iterate over categories using Object.entries for safe property access
  Object.entries(typographyData).forEach(([category, details]) => {
    Object.entries(details).forEach(([level, { value }]) => {
      if (!value) return;
      const typeKey = `.type-${category.toLowerCase()}-${level}`;
      cssStyles[typeKey] = {
        "font-size": value.fontSize,
        "font-family": value.fontFamily,
        "font-weight": value.fontWeight,
        "font-style": "normal",
        "line-height": value.lineHeight,
        "letter-spacing": value.letterSpacing.replace(/\s/g, "") || "normal",
        "text-decoration": value.textDecoration || "none",
        "text-transform": "none",
      };
    });
  });

  return cssStyles;
}
