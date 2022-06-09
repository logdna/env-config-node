## Changelog

# [2.0.0](https://github.com/logdna/env-config-node/compare/v1.1.0...v2.0.0) (2022-06-09)


### Bug Fixes

* Correct boolean test to not use `required` [6f730aa](https://github.com/logdna/env-config-node/commit/6f730aaa78fb096485dd73f4894c650171973f67) - Darin Spivey


### Code Refactoring

* A value of empty string should apply the default value [1c93bba](https://github.com/logdna/env-config-node/commit/1c93bba14cd247fc73d094840bf378fc2b3baa91) - Darin Spivey


### Features

* allowEmpty() will allow '' to be a valid value [f46bb1d](https://github.com/logdna/env-config-node/commit/f46bb1d07b4141efd9516059fa592f015a50565d) - Darin Spivey


### Miscellaneous

* CI test with newer versions of node [bb2482e](https://github.com/logdna/env-config-node/commit/bb2482e06f7cf85306be26c812189aa053c13700) - Darin Spivey
* eslint-config-logdna@6.1.0 [c48ec52](https://github.com/logdna/env-config-node/commit/c48ec5227c7a51d9c058f5d25f93b5ded2c2f322) - Darin Spivey
* tap@16.2.0 [ec66875](https://github.com/logdna/env-config-node/commit/ec668757cdf05774c0af75e5f762b482fe04c257) - Darin Spivey


### Style

* Give custom errors their own files [59c3811](https://github.com/logdna/env-config-node/commit/59c381165987c98b74552f88111f5c34af1a0516) - Darin Spivey


### **BREAKING CHANGES**

* This change affects the way that default values
are assigned, and the default value will now be used if the
env var's value is ''. Also, using `.required()` and `.default()`
in the same definition will now result in a mutex error.

# [1.1.0](https://github.com/logdna/env-config-node/compare/v1.0.5...v1.1.0) (2021-04-16)


### Features

* expose a list type [19b5c0d](https://github.com/logdna/env-config-node/commit/19b5c0d544820c6e1054929dd526291040ca1644) - Eric Satterwhite


### Miscellaneous

* add @esatterwhite as a contributor [a8012ac](https://github.com/logdna/env-config-node/commit/a8012acbc62d6d7bd9186c3cd67f96025b506a3d) - Eric Satterwhite

## [1.0.5](https://github.com/logdna/env-config-node/compare/v1.0.4...v1.0.5) (2021-02-16)


### Bug Fixes

* Replace .npmignore with `files` whitelist [b0f3e68](https://github.com/logdna/env-config-node/commit/b0f3e686f9da32fa52c0dc2c0a6fab0c15058387) - Darin Spivey


### Miscellaneous

* add @darinspivey as a contributor [4c79cd0](https://github.com/logdna/env-config-node/commit/4c79cd0a3a41679e8108c7cf193704b314ba44bb) - Darin Spivey
* add @evanlucas as a contributor [9f923ab](https://github.com/logdna/env-config-node/commit/9f923abd77fd30eaa338ce81b37bd0267f9e2d4f) - Darin Spivey
* add @jakedipity as a contributor [7d56f16](https://github.com/logdna/env-config-node/commit/7d56f1653782b6f079641cd7a9eade27a326a2ba) - Darin Spivey
* eslint-config-logdna@4.0.2 [d73e31d](https://github.com/logdna/env-config-node/commit/d73e31d4d4478a259df6418eca07d27d338c798d) - Darin Spivey
* Install and use semantic release [b93ddfc](https://github.com/logdna/env-config-node/commit/b93ddfc53f551537e37bb4ff7ee8549d4877e287) - Darin Spivey

# 2021-02-11, Version 1.0.4 (Stable)

* [[464835d214](https://github.com/logdna/env-config-node/commit/464835d214)] - fix: Change branch to main and add contributors (Darin Spivey)

# 2020-10-30, Version 1.0.3 (Stable)

* [[39a8145cbb](https://github.com/logdna/env-config-node/commit/39a8145cbb)] - Add PR source validation to Jenkinsfile (Jacob Hull) [LOG-7715](https://logdna.atlassian.net/browse/LOG-7715)

# 2020-10-16, Version 1.0.2 (Stable)

* [[d718145081](https://github.com/logdna/env-config-node/commit/d718145081)] - feat: Add code coverage badge to README (Darin Spivey) [LOG-7634](https://logdna.atlassian.net/browse/LOG-7634)
* [[5e72d46ad0](https://github.com/logdna/env-config-node/commit/5e72d46ad0)] - fix: Jenkinsfile needs individual workspaces (Darin Spivey) [LOG-7634](https://logdna.atlassian.net/browse/LOG-7634)
* [[4dd4f5d5f0](https://github.com/logdna/env-config-node/commit/4dd4f5d5f0)] - fix: Add test to .npmignore (Darin Spivey) [LOG-7634](https://logdna.atlassian.net/browse/LOG-7634)
* [[c82fe65c40](https://github.com/logdna/env-config-node/commit/c82fe65c40)] - package: Add LICENSE (Darin Spivey) [LOG-7634](https://logdna.atlassian.net/browse/LOG-7634)

# 2020-10-02, Version 1.0.1 (Stable)

* [[47e7e0568e](https://github.com/logdna/env-config-node/commit/47e7e0568e)] - fix: Load the commit template via husky (Darin Spivey) [LOG-7458](https://logdna.atlassian.net/browse/LOG-7458)

# 2020-10-01, Version 1.0.0 (Stable)

* [[ee130ccbab](https://github.com/logdna/env-config-node/commit/ee130ccbab)] - **(SEMVER-MAJOR)** package: Open source the env config package (Darin Spivey) [LOG-7311](https://logdna.atlassian.net/browse/LOG-7311)
