export function autoComplete() {
    const client = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
    const gstar = client.initIndex('gstar_demo_test');
    const gstardetail = client.initIndex('Gstar_demo_carousel_detail');


    autocomplete('#aa-search-input', {}, [
        {
            source: autocomplete.sources.hits(gstar, { hitsPerPage: 3 }),
            displayKey: 'name',
            templates: {
                header: '<div class="aa-suggestions-category">Product</div>',
                suggestion({ _highlightResult }) {
                    return `<div class="aa-suggestions-product">
                                <img src="${_highlightResult.image_link.value}">
                                <div class="aa-suggestions-product-info">
                                    <span>${_highlightResult.name.value}</span>
                                    <p>$${_highlightResult.price.value}</p>
                                </div>
                            </div>
                            `;
                }
            }
        },
        {
            source: autocomplete.sources.hits(gstardetail, { hitsPerPage: 5 }),
            displayKey: 'name',
            templates: {
                header: '<div class="aa-suggestions-category">Category</div>',
                suggestion({ _highlightResult }) {
                    return `<span>${_highlightResult.category.value}</span>`;
                }
            }
        }
    ]);
}