#!/usr/bin/env bash
set -e # Exit with nonzero exit code if anything fails

PACKAGE_NAME="ZUIX"
CURRENT_VERSION=`grep '"version":' package.json | cut -d\" -f4`

TARGET_BRANCH="gh-pages"
TARGET_DIR="_tmp"

function doCompile {
  gulp
}

function publishPackages {
    # publish zuix dev package
    npm publish
    # publish zuix-dist package
    cd dist
    npm publish
    cd ..
}

function deployWebSite {
    # Save some useful information
    REPO=`git config remote.origin.url`
    SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
    SHA=`git rev-parse --verify HEAD`

    # Clone the existing gh-pages for this repo into ${TEMP_DIR}/
    # Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
    git clone ${REPO} ${TARGET_DIR}
    cd ${TARGET_DIR}
    git checkout ${TARGET_BRANCH} || git checkout --orphan ${TARGET_BRANCH}
    cd ..

    # Clean $TEMP_DIR existing contents (NOT NEEDED IN THIS CASE)
    #rm -rf $TEMP_DIR/**/* || exit 0

    # Now let's go have some fun with the cloned repo
    # Copy ZUIX API JSDocs data files (JSON)
    cp -rfv _docs/* ${TARGET_DIR}/
    # Copy ZUIX dist files
    cp -rfv dist/js ${TARGET_DIR}/
    cd ${TARGET_DIR}
    git status

    # If there are no changes to the compiled out (e.g. this is a README update) then just bail.
    if git diff-index --quiet HEAD --; then
        echo "No changes to the output on this push; exiting."
        exit 0
    fi

    # Version number increment in the Download page
    node ../node_modules/replace/bin/replace.js "${PACKAGE_NAME} v\\d+\\.\\d+\\.\\d+\\-\\d+" "${PACKAGE_NAME} v${CURRENT_VERSION}" ./content/start.html
    node ../node_modules/replace/bin/replace.js "${PACKAGE_NAME} v\\d+\\.\\d+\\.\\d+\\-\\d+" "${PACKAGE_NAME} v${CURRENT_VERSION}" ./app.bundle.js

    # Commit the "changes", i.e. the new version.
    # The delta will show diffs between new and old versions.
    git config user.name "Travis CI"
    git config user.email "ci@travis-ci.org"
    git status
    git add -A .
    git commit -m "Deploy to GitHub Pages (${TRAVIS_BUILD_NUMBER}): ${SHA}"

    # Get the deploy key by using Travis's stored variables to decrypt build/github_deploy_key.enc
    ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
    ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
    ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
    ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
    openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ../build/github_deploy_key.enc -out ../build/github_deploy_key -d
    chmod 600 ../build/github_deploy_key
    eval `ssh-agent -s`
    ssh-add ../build/github_deploy_key

    # Now that we're all set up, we can push.
    git push $SSH_REPO $TARGET_BRANCH
}

doCompile

echo "-----"
echo "TRAVIS_PULL_REQUEST = $TRAVIS_PULL_REQUEST"
echo "TRAVIS_BRANCH = $TRAVIS_BRANCH"
echo "TRAVIS_TAG = $TRAVIS_TAG"
echo "TRAVIS_BUILD_NUMBER = $TRAVIS_BUILD_NUMBER"
echo "-----"

# Verify conditions for deploy
if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "$TRAVIS_TAG" ]; then
    echo "Deploying new release $TRAVIS_TAG to gh-pages..."
    echo ""
    deployWebSite
    echo ""
    echo "... done!"
    # npm publish disabled - TODO: to be fixed / tested
    #publishPackages
    echo "-----"
    echo "Automatic NPM publishing is disabled, do not forget to"
    echo "manually run 'npm publish' both from './' and './dist' folders"
    echo "-----"
fi
