#!/bin/bash

# Reset lib dir
rm -rf lib
mkdir lib

# Copy static assets to lib dir
cp -R src/public lib
cp node_modules/clipboard/dist/clipboard.min.js lib/public

# Tailwind purges unused css in its build process, since we dont know what html
# the user will use until the cli script has run, we wont have final html
# with the tailwind classes injected. Therefore we prebuild the css static asset
# using a sample html with the likely html tags and css a user will need.
npx tailwindcss -i src/input.css -o lib/public/tailwind.css

# Build cli program

node ./bin/esbuild.js
chmod +x ./lib/cli.js
