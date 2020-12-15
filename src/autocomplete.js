
import algoliasearch from 'algoliasearch';
// import { autocomplete } from 'instantsearch.js/es/connectors';
import autocomplete from 'autocomplete.js'

export function autoComplete() {
    const client = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
    const gstar = client.initIndex('gstar_demo_test');
    const gstardetail = client.initIndex('Gstar_demo_carousel_detail');

    function newHitsSource(index, params) {
        return function doSearch(query, cb) {
            index
                .search(query, params)
                .then(function (res) {
                    cb(res.hits, res);
                })
                .catch(function (err) {
                    console.error(err);
                    cb([]);
                });
        };
    }


    autocomplete('#aa-search-input', {}, [
        {
            source: newHitsSource(gstar, { hitsPerPage: 3 }),
            displayKey: 'name',
            templates: {
                header: '<div class="aa-suggestions-category">Product</div>',
                suggestion({ _highlightResult }) {
                    return ` <a href="./searchResults.html" >
                                <div class="aa-suggestions-product">
                                    <img src="${_highlightResult.image_link.value}">
                                    <div class="aa-suggestions-product-info">
                                        <span>${_highlightResult.name.value}</span>
                                        <p>$${_highlightResult.price.value}</p>
                                    </div>
                                </div>
                            </a>
                            `;
                }
            }
        },
        {
            source: newHitsSource(gstardetail, { hitsPerPage: 5 }),
            displayKey: 'name',
            templates: {
                header: '<div class="aa-suggestions-category">Category</div>',
                suggestion({ _highlightResult }) {
                    return `
                    <a href="./searchResults.html>
                        <span>${_highlightResult.category.value}</span>
                    </a>`;
                }
            }
        }
    ]).on('autocomplete:selected', function (event, suggestion, dataset, context) {
        console.log(event, suggestion, dataset, context);
    });
}

// var client = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey');
// var index = client.initIndex('YourIndex');

// function newHitsSource(index, params) {
//     return function doSearch(query, cb) {
//         index
//             .search(query, params)
//             .then(function (res) {
//                 cb(res.hits, res);
//             })
//             .catch(function (err) {
//                 console.error(err);
//                 cb([]);
//             });
//     };
// }

// autocomplete('#search-input', { hint: false }, [
//     {
//         source: newHitsSource(index, { hitsPerPage: 5 }),
//         displayKey: 'my_attribute',
//         templates: {
//             suggestion: function (suggestion) {
//                 return suggestion._highlightResult.my_attribute.value;
//             }
//         }
//     }
// ]).on('autocomplete:selected', function (event, suggestion, dataset, context) {
//     console.log(event, suggestion, dataset, context);
// });