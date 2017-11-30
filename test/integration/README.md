# Tests for Mozilla's Lockbox WebExtension

Thank you for checking out Mozilla's Lockbox WebExtension!

Note: These tests are written in python and use pytest as the runner.

## How to run the tests locally

### Clone the repository
If you have cloned this project already then you can skip this, otherwise you'll need to clone this repo using Git.
If you do not know how to clone a GitHub repository, check out this
[help page][git-clone] from GitHub.

If you think you would like to contribute to the tests by writing or maintaining them in the future,
it would be a good idea to create a fork of this repository first, and then clone that.
GitHub also has great instructions for [forking a repository][git-fork].

### Build the webextension

The tests expect the webextension to be built. If not you will receive an error stating that the
addon or webextension is not found.

```sh
npm install
npm run package
```

### Run the tests
The tests must be run in Firefox 57 or later.

1. Install [Tox].
2. Download geckodriver [v0.19.1][geckodriver] or later and ensure it's executable and
   in your path.

```bash
tox
```
This will run the integration tests as well as [flake8][flake8].

## Changing or adding element selectors

[Selenium] allows for multiple types of HTML/CSS selection methods. The documentation found
[here][selenium-api] shows the different ways to use these available methods.

The pytest plugin that we use for running tests has a number of advanced
command line options available. To see the options available, run
`pytest --help`. The full documentation for the plugin can be found
[here][pytest-selenium].

[flake8]: http://flake8.pycqa.org/en/latest/
[git-clone]: https://help.github.com/articles/cloning-a-repository/
[git-fork]: https://help.github.com/articles/fork-a-repo/
[geckodriver]: https://github.com/mozilla/geckodriver/releases/tag/v0.19.1
[pytest-selenium]: http://pytest-selenium.readthedocs.org/
[Selenium]: http://selenium-python.readthedocs.io/index.html
[selenium-api]: http://selenium-python.readthedocs.io/locating-elements.html
[Tox]: http://tox.readthedocs.io/
