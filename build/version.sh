#!/usr/bin/env bash
set -e

NEW_VERSION=$1

if [[ $NEW_VERSION == v* ]]; then
  NEW_VERSION=${NEW_VERSION:1}
fi

PACKAGE_NAME_REGEX="\\[zuix\\.js"
PACKAGE_NAME="[zuix.js"

echo "Updating README.md for new version v${NEW_VERSION}..."

sed -i.bak "s/${PACKAGE_NAME_REGEX} v[0-9]*\\.[0-9]*\\.[0-9]*/${PACKAGE_NAME} v${NEW_VERSION}/g" ./README.md
rm ./README.md.bak

git add ./README.md
