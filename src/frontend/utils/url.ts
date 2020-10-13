import { ParsedQuery } from 'query-string';

export const hentQueryIdFraUrl = (queryString: ParsedQuery, key: string): string | undefined => {
    const queryParam = queryString[key];
    return queryParam ? (Array.isArray(queryParam) ? queryParam[0] : queryParam) : undefined;
};
