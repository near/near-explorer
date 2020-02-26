# Contributing to NEAR Explorer

Thank you for your interest in contributing to NEAR! There are many opportunities to contribute:
https://docs.nearprotocol.com/docs/contribution/contribution-overview

## Feature Requests

To request a change to the way the NEAR Explorer language works, please head over to the issues
page on Github and file an issue.

## Bug Reports

While bugs are unfortunate, they're a reality in software. We can't fix what we don't know about,
so please report liberally. If you're not sure if something is a bug or not, feel free to file a
bug anyway.

If you believe reporting your bug publicly represents a security risk to NEAR users, please send us
[a message via GitHub Security tab](https://github.com/nearprotocol/near-explorer/security/advisories).

## Pull Requests

Pull requests are the primary mechanism we use to change NEAR projects. GitHub itself has some
[great documentation](https://help.github.com/articles/about-pull-requests/) on using the Pull
Request feature. We use the "fork and pull" model
[described here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-collaborative-development-models),
where contributors push changes to their personal fork and create pull requests to bring those
changes into the source repository.

Please make pull requests against the `master` branch.

GitHub allows closing issues using keywords. This feature should be used to keep the issue tracker
tidy. However, it is generally preferred to put the "closes #123" text in the PR description
rather than the issue commit; particularly during rebasing, citing the issue number in the commit
can "spam" the issue in question.

Once Pull Request is ready and reviewed by the code owners, it gets squashed into a single commit,
where the commit message should follow
[Conventional Commits](https://commonwealth.im/near/proposal/discussion/264-the-commit-template)
style.

## Code Style

We use [prettier](https://prettier.io/) with the default config to ensure the code style for NEAR Explorer. We check for the code style on CI. However, we have some extra rules to make our code base even more consistent.

### Imports Ordering and Grouping

We use the following order to group our imports:

1. standard JS/node.js library imports
2. generic JS libraries
3. framework imports
4. framework core libraries
5. external framework libraries
6. common internal modules
7. local internal modules (sorted from higher hierarchy to local scope)

We maintain alphabetical order by a package/module name (the thing after `from` keyword) inside each group.

Here is an artificial example:

```javascript
import url from "url";

import BN from "bn.js";
import moment from "moment";

import Head from "next/head";
import Link from "next/link";

import React from "react";

import { Row, Col } from "react-bootstrap";

import BlocksApi from "../../libraries/explorer-wamp/blocks";

import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";
import DashboardBlocksBlock from "./DashboardBlocksBlock";
```

### Naming

We follow [airbnb naming conventions](https://github.com/airbnb/javascript#naming-conventions).
