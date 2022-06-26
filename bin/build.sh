#!/bin/bash

input_dir="input"
output_dir="output"
while getopts ":i:o:" opt; do
  case $opt in
    i)
      input_dir=$OPTARG
      ;;
    o)
      output_dir=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

echo $input_dir
echo $output_dir

# # Reset build directory
# rm -rf build
# cp -r input build
#
# # Move static assets
# cp node_modules/clipboard/dist/clipboard.min.js build/
# cp src/index.js build/index.js
#
# # Setup html
# node bin/build_html.js "build"
#
# # Build css
# # Note, given how tailwind compiles css that is acutally used, this has to come
# # the `build html` step.
# npx tailwindcss -i ./src/input.css -o ./build/tailwind.css --minify
#
