# Docs to Prose 📖

Convert a directory of html files to a new directory of styled and enhanced html
files suitable for everyday documentation enjoying.

![showcase](./docs_to_prose_showcase_short.gif)

## Usage

### Install the cli

```
npm install -g docs-to-prose
```

### Convert your `docs` to ✨`docs with prose`✨

```
toprose --input initial_docs/ --output docs_with_prose/
```

### Serve the new docs using any web server

```
npm install -g serve
serve docs_with_prose/
```

## What's included

### Typographic defaults for all HTML

Using [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)'s
prose style utility classes, we render all html in a well designed and easy to
read style.

### Copy to clipboard for all code tags

Using [clipboard.js](https://clipboardjs.com/), we insert a script for copying
`<code>` and `<pre>` tags' innerHTML content to your system clipboard.
