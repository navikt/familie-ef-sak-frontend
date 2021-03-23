import axios from 'axios';
import { Toggles } from '../context/toggles';

const hentToggles = (settToggles: (toggles: Toggles) => void) => {
    return axios
        .get(`/api/featuretoggle`, {
            withCredentials: true,
        })
        .then((response: { data: any }) => {
            settToggles(response.data);
        });
};

export default hentToggles;
