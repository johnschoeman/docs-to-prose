#!/bin/bash

rm -rf build
cp -r public build
npx tailwindcss -i ./input.css -o ./build/tailwind.css --minify
