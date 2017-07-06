# Contributing

When contributing to this repository, please first discuss the change you wish to make via the
[issue tracker](https://github.com/genielabs/zuix/issues) before making a change.

Note we have a code of conduct, please follow it in all your interactions with the project.

## How to contribute to ZUIX

#### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/genielabs/zuix/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/genielabs/zuix/issues/new).
Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample**
or an **executable test case** demonstrating the expected behavior that is not occurring.

#### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution.
Include the relevant issue number if applicable.

#### **Did you fix whitespace, format code, or make a purely cosmetic patch?**

Changes that are cosmetic in nature and do not add anything substantial to the stability, functionality,
or testability of ZUIX will generally not be accepted unless discussed via the [issue tracker](https://github.com/genielabs/zuix/issues).

#### **Do you intend to add a new feature or change an existing one?**

File a new *[enhancement issue](https://github.com/genielabs/zuix/issues/new?labels=enhancement)*.

#### **Do you have questions about the source code?**

File a new *[question issue](https://github.com/genielabs/zuix/issues/new?labels=question)*.

#### **Do you want to contribute to the ZUIX documentation?**

The documentation site source code is available from the **[gh-pages](https://github.com/genielabs/zuix/tree/gh-pages)** branch, you can
contribute following same rules used for the main repo.

#### **Coding styles and conventions**

Please follow [standardjs.com](https://standardjs.com/rules.html) coding rules.
You may find out that some of these rules are not respected in the existing code,
but this will be fixed from time to time.

#### **Getting started with ZUIX source code**

Clone [**ZUIX repository**](https://github.com/genielabs/zuix) or install
`zuix` development package from *NPM*

    npm install zuix

Start local web server (currently only for *gh-pages* branch).

    npm run start

###### Build

Build source and create minified version in `./dist/js` folder:

    gulp

or

    npm run build

this will also generate JSON formatted **ZUIX API** files in the `_docs` folder
and **ZUIX TypeScript** definition file in the `./dist/js` folder.

To submit a new release

    npm run release <newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease

if passing *CI* tests this will also publish *npm packages* and update *ZUIX web site*
files in *gh-pages* branch.
The script run on the *CI* server side is

    npm run deploy

#### Join ZUIX team!

ZUIX is a volunteer effort. We encourage you to pitch in and join the team!

Thanks! :heart: :heart: :heart:

