export declare function search_country(query: {
    id?: string;
    alpha2?: string;
    alpha3?: string;
}): {
    id: number;
    alpha2: string;
    alpha3: string;
    ar: string;
    bg: string;
    cs: string;
    da: string;
    de: string;
    el: string;
    en: string;
    eo: string;
    es: string;
    et: string;
    eu: string;
    fi: string;
    fr: string;
    hu: string;
    it: string;
    ja: string;
    ko: string;
    lt: string;
    nl: string;
    no: string;
    pl: string;
    pt: string;
    ro: string;
    ru: string;
    sk: string;
    sv: string;
    th: string;
    uk: string;
    zh: string;
    'zh-tw': string;
};
export declare const getCountryRegions: (countryCode: string) => {
    label: string;
    value: string;
}[];
export declare const getCountryDropDownOptions: () => {
    label: string;
    value: string;
}[];
export declare const getCurrencies: () => string[];
export declare const getLanguages: () => {
    value: string;
    label: string;
}[];
