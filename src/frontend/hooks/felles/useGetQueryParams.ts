import { useLocation } from 'react-router';

export function useGetQueryParams(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}
