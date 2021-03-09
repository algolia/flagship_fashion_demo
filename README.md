<div style="display:flex; justify-content:center; flex-direction:column; text-align:center;">
<h1 style="font-family='Helvetica'; font-size=18px; font-weight=bold; color=grey;">FASHION DEMO FOR RETAILERS</h1>

<img src="https://i.ibb.co/b3FwNnp/Screenshot-2021-03-09-at-10-41-49.png" alt="Fashion demo" width="800" style="margin: 2rem auto"/>

We use [Commitlint](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) with a [conventional configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional), this is enforced using a hook via [Husky](https://www.npmjs.com/package/husky)

</div>

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ How to contribute</h2>

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

Please provide the following environment variables before deploying:
When Goes public use Environment Variables

<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey;">⭐️ Branches</h2>

- new features should be developed on a new branch and then merged into `next`
- `master` consists of the latest stable version of the application in production
- `next` is akin to the next beta release and should be used for testing
- `next` is pushed to master on a continuous basis, defined by each sprints output



<h2 style="font-family='Helvetica'; font-size=15px; font-weight=bold; color=grey; margin-top=2rem;">⭐️ Algolia s features implemented & docs</h2>

<div style="text-align=left; margin-top:2rem;">


**📙 Documentation :**

 - *Personalised Carousel*

✅ [Dynamic content Carousel](https://www.algolia.com/doc/guides/solutions/gallery/dynamic-content-carousels/)

✅ [Personalised Carousel](https://www.algolia.com/doc/guides/getting-insights-and-analytics/personalization/personalizing-results/)


 - *Autocomplete*

✅ [Autocomplete Documentation](https://autocomplete.algolia.com/) 

✅ [Autocomplete Widget](https://www.algolia.com/doc/api-reference/widgets/autocomplete/js/)
 
✅ [Autocomplete with multiple index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/multi-index-search/js/#search-in-multiple-indices) 

- *RefinementList*

✅ [Refinement List](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/) 

- *Current refinement*

✅ [Current Refinement](https://www.algolia.com/doc/api-reference/widgets/current-refinements/js/) 

- *Content Injection*

✅ [Project Tutorial](https://docs.google.com/document/d/1zHbjhogqDZPLMyu9D0AVlT_rhEalv61tkYPo9U1k0Co/edit#) 

✅ [Dashboard Tutorial](https://algolia.atlassian.net/wiki/spaces/PK/pages/1370489151/IN+REVIEW+Content+Injection+in+Results+With+Query+Rules)

- *Guided Navigation*

✅ [Refinement list Connector Widget](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/#connector)

✅ [Predictive Search & Query suggestions](https://www.algolia.com/doc/guides/solutions/gallery/predictive-search-suggestions/) 

- *Related items*

✅ [Related Items](https://www.algolia.com/doc/guides/solutions/gallery/related-items/) 

- *Banner Injection*

✅ [Content Injection Banner](https://www.algolia.com/doc/guides/managing-results/rules/merchandising-and-promoting/how-to/add-banners/) 

- *Clear Refinement*

✅ [Clear Refinement Widget](https://www.algolia.com/doc/api-reference/widgets/clear-refinements/js/) 

- *Stats*

✅ [Display Search Statistics](https://www.algolia.com/doc/api-reference/widgets/stats/js/) 

- *Smart SortBy*

✅ [Smart Sort (Beta)](https://docs.google.com/document/d/1hqQdWT38BBfU9_OKWfZpM5I1ga-nPyG8FcW2OSXYAe0/edit#) 

- *Pagination*

✅ [Pagination](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/pagination/js/)
 
✅ [Pagination 2](https://www.algolia.com/doc/api-reference/widgets/pagination/js/) 

 - *Range Slider*

✅ [Range Slider](https://www.algolia.com/doc/api-reference/widgets/range-slider/js/) 

 - *Color / Visual Facets*

✅ [Handle Visual Facets](https://www.algolia.com/doc/guides/solutions/gallery/visual-facets/) 

- *Routing*

✅ [Route your app](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/js/) 

- *Federated Search*

✅ [Federated Search Dropdown](https://www.algolia.com/doc/guides/solutions/gallery/federated-search/) 

- *VoiceSearch*

✅ [VoiceSearch](https://www.algolia.com/doc/api-reference/widgets/voice-search/js/) 

- *Insight event*

✅ [Send events to analytics](https://www.algolia.com/doc/guides/building-search-ui/going-further/send-insights-events/js/)
</div>


