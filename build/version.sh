#!/usr/bin/env bash
set -e
PACKAGE_NAME="zuix.js"
echo "Updating README.md for new version v${npm_package_version}..."
sed -i.bak "s/${PACKAGE_NAME} v[0-9]*\.[0-9]*\.[0-9]*/${PACKAGE_NAME} v${npm_package_version}/g" ./README.md
rm ./README.md.bak
git add ./README.md
