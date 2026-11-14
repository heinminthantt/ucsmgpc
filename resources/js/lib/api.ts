import axios from 'axios';

const api = axios.create({
    baseURL: '/data',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default api;
