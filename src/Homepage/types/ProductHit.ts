import { Hit } from '@algolia/client-search';

type ProductRecord = {
    brand: string;
    categories: string[];
    description: string;
    image_link: string;
    name: string;
    price: number;
    rating: number;
    url: string;
    image:string;
};

type WithAutocompleteAnalytics<THit> = THit & {
    __autocomplete_indexName: string;
    __autocomplete_queryID: string;
};

export type ProductHit = WithAutocompleteAnalytics<Hit<ProductRecord>>;