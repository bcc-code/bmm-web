// @ts-check
/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: "media.bcc.bmm-web",
  productName: "BMM",
  files: [
    { from: ".output/public", to: "dist-electron", filter: ["**/*"] },
    { from: "dist-electron", to: "dist-electron", filter: ["**/*"] },
    "package.json",
    "!node_modules",
  ],
  directories: {
    output: "dist-app",
  },
  protocols: [{ name: "Custom BMM", schemes: ["bmm"] }],
  mac: {
    category: "public.app-category.music",
    entitlements: "build/entitlements.mac.plist",
    icon: "resources/app.icns",
    hardenedRuntime: true,
    darkModeSupport: true,
    gatekeeperAssess: true,
    target: [
      {
        target: "default",
        arch: "x64",
      },
      { target: "default", arch: "arm64" },
    ],
    notarize: {
      teamId: process.env.APPLE_TEAM_ID || "",
    },
  },
  win: {
    target: ["nsis", "zip"],
    signingHashAlgorithms: ["sha256"],
    sign: "./electron_sign_exe.js",
    publisherName: "BCC MEDIA STI",
    legalTrademarks: "(C) 2024 BCC MEDIA STI",
  },
  linux: {
    category: "Audio;Player",
    desktop: {
      Keywords:
        "audio;bcc;bmm;brunstad;christian;church;edification;faith;media;music;sermon",
      SingleMainWindow: true,
      StartupWMClass: "bmm-web",
      MimeType: "x-scheme-handler/bmm",
    },
    target: ["AppImage", "deb"],
  },
  deb: {
    packageName: "bmm-web",
    // For questions specific to the Debian package, users can e-mail me.
    // We don't have an author e-mail in the package.json, otherwise that one would be used.
    // For Debian packages such information is mandatory
    maintainer: "gijsbertth+bmm-web.deb-ACvYJHQajj4ArT1JgO4osw@gmail.com",
    depends: ["libnotify4", "libxtst6", "libnss3"],
    recommends: [
      // Most XDG supporting desktop distros will use a trigger installed by this package to automatically register the URI scheme handling.
      // However, the app RUNs without it, and distros are free to provide a different mechanism (or let the user handle it manually).
      // Documentation states: (https://www.debian.org/doc/debian-policy/ch-relationships.html)
      // > This declares a strong, but not absolute, dependency.
      // > The Recommends field should list packages that would be found together with this one in all but unusual installations.
      "desktop-file-utils",
    ],
    packageCategory: "sound",
  },
};

// To debug the auto update on Mac, you can right click on BMM.app and "Show package contents".
// Then open Contents/MacOS/BMM, which starts a terminal window with some logs and the BMM app as well.
// The terminal window should give an error message telling you what went wrong.

module.exports = config;
