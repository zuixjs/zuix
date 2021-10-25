# Contributing

## How to contribute to zUIx

#### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/zuixjs/zuix/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/zuixjs/zuix/issues/new).
Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample**
or an **executable test case** demonstrating the expected behavior that is not occurring.

#### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution.
Include the relevant issue number if applicable.

#### **Did you fix whitespace, format code, or make a purely cosmetic patch?**

Changes that are cosmetic in nature and do not add anything substantial to the stability, functionality,
or testability of zUIx will generally not be accepted unless discussed via the [issue tracker](https://github.com/zuixjs/zuix/issues).

#### **Do you intend to add a new feature or change an existing one?**

File a new *[enhancement issue](https://github.com/zuixjs/zuix/issues/new?labels=enhancement)*.

#### **Do you have questions about the source code?**

File a new *[question issue](https://github.com/zuixjs/zuix/issues/new?labels=question)*.

#### **Coding styles and conventions**

This project follows [standardjs.com](https://standardjs.com/rules.html) coding rules.
The build script also includes *ESLint* checks that are mainly based off the
`eslint-config-google`.
You may find out that some of these rules are not fully respected in the existing code,
but this will be fixed from time to time.

#### Implementation notes

See the [src/README.md](https://github.com/zuixjs/zuix/blob/master/src/README.md#implementation-notes-and-code-structure) file.

#### **Getting started with zUIx source code**

Clone [**zUIx repository**](https://github.com/zuixjs/zuix) and install dependencies:

    npm install

###### Build

Build source and create minified version in `./dist/js` folder:

    npm run build

To submit a new release

    npm run release <newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease

If for instance current published version is 1.0.6, `npm run release patch` will build library, bump version to 1.0.7 and publish it.

if passing *CI* tests, new release files will be copied to the CDN website (`./docs` folder) and the version number in the `README.md` file will be updated.
Also the new API data files will be updated in the `./docs/api` folder.
The script run on the *CI* server side is

    npm run deploy


#### Join zUIx team!

zUIx is a volunteer effort. We encourage you to pitch in and join the team!

Thanks! :heart:
