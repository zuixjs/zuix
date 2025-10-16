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

---

### **Getting started with zUIx source code**

#### Local Development

Clone the [**zUIx repository**](https://github.com/zuixjs/zuix) and install dependencies:

    npm install

To build the source and create the minified version in the `./dist/js` folder:

    npm run build

#### Publishing a New Release (for Maintainers)

The release process is automated using GitHub Actions and triggered by pushing a new version tag.

**Step 1: Create the new version**

Ensure you are on the main branch and all changes are committed. Then, run the `npm version` command. This will automatically update the `README.md`, update the version in `package.json`, and create a version commit and tag.

```bash
# For a patch release (e.g., 1.0.0 -> 1.0.1)
npm version patch

# For a minor release (e.g., 1.0.1 -> 1.1.0)
npm version minor

# For a major release (e.g., 1.1.0 -> 2.0.0)
npm version major
```

**Step 2: Push the commit and tag to GitHub**

Push the newly created commit and tag to the repository. This will trigger the automated release workflow.

```bash
git push --follow-tags
```

**Automated Process via GitHub Actions**

Once the new tag is pushed, a GitHub Actions workflow will automatically:
1.  Build the project.
2.  Run post-build tasks (like adding version headers to JS files).
3.  Publish the `zuix-dist` package from the `/dist` folder to NPM.
4.  Generate API documentation.
5.  Copy the final distribution files and API docs to the `/docs` folder.
6.  Commit and push the updated `/docs` folder back to the repository.

---

#### Join the zUIx team!

zUIx is a volunteer effort. We encourage you to pitch in and join the team!

Thanks! :heart:
