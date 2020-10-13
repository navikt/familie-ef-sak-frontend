import { useLocation } from 'react-router';
import * as queryString from 'query-string';
import { hentQueryIdFraUrl } from '../utils/url';

export function useGetQueryParams(key: string): string | undefined {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    return hentQueryIdFraUrl(queryParams, key);
}
