const fs = require("fs");

// # build_html.js
//
// Add the `with-prose` class and inserts script and stylesheet tags into all
// html documents in the directory.
//
// ## Before
//
// <html>
// <head>
// <title>Page Title</title>
// </head>
// <body>
// <h1>Page Header</h1>
// </body>
// </html>
//
// ## After
//
// <html>
// <head>
// <title>Page Title</title>
// <link rel="stylesheet" type="text/css" href="./tailwind.css">
// <script src="./clipboard.min.js"></script>
// </head>
// <body class="with-prose">
// <h1>Page Header</h1>
// </body>
// <script src="./index.js"></script>
// </html>
//
// ---
//
// # Notes
//
// - This script assumes the <head> and <body> tags are closed with </head> and
// </body> respectively, if your html doesn't close these tags (you monster), it
// will fail. It also assumes you have a <body> tag.
//
// - This script mutates the files in the target directory. Copy source files
// into a new directory prior to running.
//
// - This script is _not_ idempotent: Running multiple times will result
// in duplicate tag insertions.
//
// - This script is naive; if you pass in wierd html, you'll probably get wierd
// results.
//

const BUILD_DIR = process.argv[2] ?? "build";

fs.readdir(BUILD_DIR, (err, files) => {
  const tailwindCSSLinkTag = buildStylesheetTag("./tailwind.css");
  const clipboardScriptTag = buildScriptTag("./clipboard.min.js");
  const indexScriptTag = buildScriptTag("./index.js");
  const headTags = [tailwindCSSLinkTag, clipboardScriptTag];
  const afterBodyTags = [indexScriptTag];

  const htmlFiles = files.filter(isHtmlExt);

  htmlFiles.forEach((file) => {
    const path = `./${BUILD_DIR}/${file}`;
    const lines = fs.readFileSync(path).toString().split("\n");

    const linesWithClass = lines.map((line) => {
      return isOpenBodyTag(line) ? addClassAttrToTag("with-prose")(line) : line;
    });

    const headIdx = linesWithClass.findIndex(isCloseHeadTag);
    const linesWithHeadTags = insert(linesWithClass, headIdx, ...headTags);

    const bodyIdx = linesWithHeadTags.findIndex(isCloseBodyTag);
    const nextLines = insert(linesWithHeadTags, bodyIdx + 1, ...afterBodyTags);

    const fileData = nextLines.join("\n");

    fs.writeFile(path, fileData, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

const insert = (arr, index, ...newItems) => {
  return [...arr.slice(0, index), ...newItems, ...arr.slice(index)];
};

const isHtmlExt = (fileName) => {
  const htmlRegex = /\.html$/;
  return fileName.match(htmlRegex);
};

const addClassAttrToTag = (classValue) => (tagStr) => {
  const classAttr = ` class=\"${classValue}\">`;
  return tagStr.replace(new RegExp(/\>$/), classAttr);
};

const isOpenBodyTag = (str) => {
  const headTagRegex = /\<body/;
  return str.match(headTagRegex);
};
const isCloseHeadTag = (str) => {
  const headTagRegex = /\<\/head\>/;
  return str.match(headTagRegex);
};
const isCloseBodyTag = (str) => {
  const headTagRegex = /\<\/body\>/;
  return str.match(headTagRegex);
};

const buildStylesheetTag = (href) => {
  return `<link rel="stylesheet" type="text/css" href="${href}">`;
};
const buildScriptTag = (href) => {
  return `<script src="${href}"></script>`;
};
