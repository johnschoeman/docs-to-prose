#!/bin/bash

rm -rf build
cp -r public build

npx tailwindcss -i ./input.css -o ./build/tailwind.css --minify
cp node_modules/clipboard/dist/clipboard.min.js build/
cp index.js build/index.js
