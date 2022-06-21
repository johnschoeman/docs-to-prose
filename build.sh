#!/bin/bash

# Reset build directory
rm -rf build
cp -r public build

# Move static assets
cp node_modules/clipboard/dist/clipboard.min.js build/
cp index.js build/index.js

# Setup html
node build_html.js "build"

# Build css
# Note, given how tailwind compiles css that is acutally used, this has to come
# the `build html` step.
npx tailwindcss -i ./input.css -o ./build/tailwind.css --minify

