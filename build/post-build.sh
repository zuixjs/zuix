#!/usr/bin/env bash
set -e

PACKAGE_NAME="zuix.js"

NEW_VERSION=$(node -p "require('./package.json').version")

echo "Running post-build tasks for v${NEW_VERSION}..."

JS_VERSION="/* ${PACKAGE_NAME} v${NEW_VERSION} $(date +'%y.%m.%d %H:%M:%S') */"
for f in dist/js/zuix*.js; do
  sed -i "1i${JS_VERSION}\n" "$f"
done

echo "Copying README.md to dist folder..."
cp -f ./README.md ./dist/

if [ -f "./dist/package.json" ]; then
    echo "Syncing version to dist/package.json -> v${NEW_VERSION}"
    npm version "${NEW_VERSION}" --no-git-tag-version --prefix ./dist
else
    echo "Warning: dist/package.json not found."
fi

echo "Post-build tasks completed."
