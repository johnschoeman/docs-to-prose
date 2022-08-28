const fsAsync = require("fs").promises
const fs = require("fs")
const path = require("path")

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

export const updateHtmlFilesIn = async targetDir => {
  for await (const { file, depth } of getFiles(targetDir)) {
    if (isHtmlExt(file)) {
      const [headTags, bodyTags] = buildTags(depth)
      const bodyClasses = ["with-prose"]
      processFile(file, bodyClasses, headTags, bodyTags)
    }
  }
}

async function* getFiles(dir, depth = 0) {
  const dirents = await fsAsync.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res, depth + 1)
    } else {
      yield { file: res, depth }
    }
  }
}

const processFile = (filePath, bodyClasses, headTags, bodyTags) => {
  const lines = fs.readFileSync(filePath).toString().split("\n")

  const linesWithClass = lines.map(line => {
    return isOpenBodyTag(line) ? addClassAttrToTag(bodyClasses)(line) : line
  })

  const headIdx = linesWithClass.findIndex(isCloseHeadTag)
  const linesWithHeadTags = insert(linesWithClass, headIdx, ...headTags)

  const bodyIdx = linesWithHeadTags.findIndex(isCloseBodyTag)
  const nextLines = insert(linesWithHeadTags, bodyIdx + 1, ...bodyTags)

  const fileData = nextLines.join("\n")

  fs.writeFile(filePath, fileData, function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

const isHtmlExt = fileName => {
  const htmlRegex = /\.html$/
  return fileName.match(htmlRegex)
}

const addClassAttrToTag = classValues => tagStr => {
  const classValue = classValues.join(" ")
  const classAttr = ` class=\"${classValue}\">`
  return tagStr.replace(new RegExp(/\>$/, "i"), classAttr)
}

const isOpenBodyTag = str => {
  const headTagRegex = new RegExp(/\<body/, "i")
  return str.match(headTagRegex)
}
const isCloseHeadTag = str => {
  const headTagRegex = new RegExp(/\<\/head\>/, "i")
  return str.match(headTagRegex)
}
const isCloseBodyTag = str => {
  const headTagRegex = new RegExp(/\<\/body\>/, "i")
  return str.match(headTagRegex)
}

const buildTags = depth => {
  const tailwindCSSLinkTag = buildStylesheetTag("public/tailwind.css", depth)
  const clipboardScriptTag = buildScriptTag("public/clipboard.min.js", depth)
  const indexScriptTag = buildScriptTag("public/index.js", depth)
  const headTags = [tailwindCSSLinkTag, clipboardScriptTag]
  const bodyTags = [indexScriptTag]
  return [headTags, bodyTags]
}

const buildStylesheetTag = (href, depth) => {
  const path = buildHrefPath(href, depth)
  return `<link rel="stylesheet" type="text/css" href="${path}">`
}
const buildScriptTag = (href, depth) => {
  const path = buildHrefPath(href, depth)
  return `<script src="${path}"></script>`
}
const buildHrefPath = (href, depth) => {
  return ["../".repeat(depth), href].join("")
}

const insert = (arr, index, ...newItems) => {
  return [...arr.slice(0, index), ...newItems, ...arr.slice(index)]
}
