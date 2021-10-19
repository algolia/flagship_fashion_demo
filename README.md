<div style="display:flex; justify-content:center; flex-direction:column; text-align:center;">
<h1 style="font-family='Helvetica'; font-size=18px; font-weight=bold; color=grey;">FASHION DEMO FOR RETAILERS</h1>

<img src="https://i.ibb.co/b3FwNnp/Screenshot-2021-03-09-at-10-41-49.png" alt="Fashion demo" width="800" style="margin: 2rem auto"/>

</div>

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Dependancies</h2>

This repository links to the Algolia application with the ID of "853MYZ81KY". It relies on certain settings, rules, data and events/analytics being present in this Algolia application.

There are two private functions running in AWS (in the solutions organisation) in order to assist with the above functions:

1. [Flagship-settings-manager](https://github.com/algolia/flagship-settings-manager): responsible for resetting rules, synonyms and settings every hour.

2. [Flagship-traffic-generator](https://github.com/algolia/flagship-traffic-generator): responsible for generating fake traffic for analytics purposes.

_We require one more function (currently in development), for generating the correct events in order to feed our AI models such as frequently bought together. Currently these models are hardcoded._

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ How to contribute</h2>

We use [Commitlint](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) with a [conventional configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional), this is enforced using a hook via [Husky](https://www.npmjs.com/package/husky)

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

### Pull Requests

You can find the correct template in /PULL_REQUEST_TEMPLATE.md, please adhere to this convention.

All PR's must be tested and subsequently approved by at least one Algolia engineer (a member of the demo engineering team if possible).

Where possible, attach an issue to a PR so it's clear what we are solving. If there is no issue, create one before submitting the PR.

# Flagship Fashion Demo

This demo serves to show Algolia in action.

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Get started</h2>

To run this project locally, install the dependencies and run the local server:

```sh
npm install
npm start
```

Alternatively, you may use [Yarn](https://http://yarnpkg.com/):

```sh
yarn install
yarn start
```

Open http://localhost:1234 to see your app.

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Configuration</h2>

Please provide the following environment variables before deploying: When Goes public use Environment Variables

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Branches</h2>

- new features should be developed on a new branch and then merged into `next`
- `master` consists of the latest stable version of the application in production
- `next` is akin to the next beta release and should be used for testing
- `next` is pushed to master on a continuous basis, defined by each sprints output

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Dependancies</h2>

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey; margin-top=2rem;">⭐️ Algolia s features implemented & docs</h2>

<div style="text-align=left; margin-top:2rem;">

**📙 Documentation :**

- _Personalised Carousel_

✅ [Dynamic content Carousel](https://www.algolia.com/doc/guides/solutions/gallery/dynamic-content-carousels/)

✅ [Personalised Carousel](https://www.algolia.com/doc/guides/getting-insights-and-analytics/personalization/personalizing-results/)

- _Autocomplete_

✅ [Autocomplete Documentation](https://autocomplete.algolia.com/)

✅ [Autocomplete Widget](https://www.algolia.com/doc/api-reference/widgets/autocomplete/js/)

✅ [Autocomplete with multiple index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/multi-index-search/js/#search-in-multiple-indices)

- _RefinementList_

✅ [Refinement List](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/)

- _Current refinement_

✅ [Current Refinement](https://www.algolia.com/doc/api-reference/widgets/current-refinements/js/)

- _Content Injection_

✅ [Project Tutorial](https://docs.google.com/document/d/1zHbjhogqDZPLMyu9D0AVlT_rhEalv61tkYPo9U1k0Co/edit#)

✅ [Dashboard Tutorial](https://algolia.atlassian.net/wiki/spaces/PK/pages/1370489151/IN+REVIEW+Content+Injection+in+Results+With+Query+Rules)

- _Guided Navigation_

✅ [Refinement list Connector Widget](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/#connector)

✅ [Predictive Search & Query suggestions](https://www.algolia.com/doc/guides/solutions/gallery/predictive-search-suggestions/)

- _Related items_

✅ [Related Items](https://www.algolia.com/doc/guides/solutions/gallery/related-items/)

- _Banner Injection_

✅ [Content Injection Banner](https://www.algolia.com/doc/guides/managing-results/rules/merchandising-and-promoting/how-to/add-banners/)

- _Clear Refinement_

✅ [Clear Refinement Widget](https://www.algolia.com/doc/api-reference/widgets/clear-refinements/js/)

- _Stats_

✅ [Display Search Statistics](https://www.algolia.com/doc/api-reference/widgets/stats/js/)

- _Smart SortBy_

✅ [Smart Sort (Beta)](https://docs.google.com/document/d/1hqQdWT38BBfU9_OKWfZpM5I1ga-nPyG8FcW2OSXYAe0/edit#)

- _Pagination_

✅ [Pagination](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/pagination/js/)

✅ [Pagination 2](https://www.algolia.com/doc/api-reference/widgets/pagination/js/)

- _Range Slider_

✅ [Range Slider](https://www.algolia.com/doc/api-reference/widgets/range-slider/js/)

- _Color / Visual Facets_

✅ [Handle Visual Facets](https://www.algolia.com/doc/guides/solutions/gallery/visual-facets/)

- _Routing_

✅ [Route your app](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/js/)

- _Federated Search_

✅ [Federated Search Dropdown](https://www.algolia.com/doc/guides/solutions/gallery/federated-search/)

- _VoiceSearch_

✅ [VoiceSearch](https://www.algolia.com/doc/api-reference/widgets/voice-search/js/)

- _Insight event_

✅ [Send events to analytics](https://www.algolia.com/doc/guides/building-search-ui/going-further/send-insights-events/js/)

</div>
