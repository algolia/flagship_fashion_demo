# Flagship Fashion Demo

This demo serves to show Algolia in action.

## Get started

To run this project locally, install the dependencies and run the local server:

```sh
yarn
yarn start
```

Open http://localhost:1234 to see your app.


## How to contribute

### Branch structure
- new features should be developed on a new branch and then merged into `next`
- `master` consists of the latest stable version of the application in production
- `next` is akin to the next beta release and should be used for testing
- `next` is pushed to master on a continuous basis, defined by each sprints output

<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stable</td>
      <td>master</td>
      <td>Accepts merges from Next and Hotfixes</td>
    </tr>
    <tr>
      <td>Next</td>
      <td>next</td>
      <td>Accepts merges from Features/Issues</td>
    </tr>
    <tr>
      <td>Features/Issues</td>
      <td>topic-*</td>
      <td>Always branch off HEAD of Stable</td>
    </tr>
    <tr>
      <td>Hotfix</td>
      <td>hotfix-*</td>
      <td>Always branch off Stable</td>
    </tr>
  </tbody>
</table>


### Commits
We use [Commitlint](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) with a [conventional configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional), this is enforced using a hook via [Husky](https://www.npmjs.com/package/husky)

### Pull Requests
You can find the correct template in /PULL_REQUEST_TEMPLATE.md, please adhere to this convention.

All PR's must be tested and subsequently approved by at least one Algolia engineer (a member of the demo engineering team if possible).

Where possible, attach an issue to a PR so it's clear what we are solving. If there is no issue, create one before submitting the PR.