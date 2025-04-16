import axios from 'axios';
import {BASE_URL} from "@/composables/constants.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    xsrfCookieName: '_csrf',
    xsrfHeaderName: 'X-CSRF-TOKEN'
});

// Add request interceptor to handle CSRF token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = document.cookie.match('(^|;)\\s*_csrf\\s*=\\s*([^;]+)');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = decodeURIComponent(token[2]);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const axiosInstanceMultipart = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    xsrfCookieName: '_csrf',
    xsrfHeaderName: 'X-CSRF-TOKEN'
});

// Add same CSRF handling to multipart instance
axiosInstanceMultipart.interceptors.request.use(
    (config) => {
        const token = document.cookie.match('(^|;)\\s*_csrf\\s*=\\s*([^;]+)');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = decodeURIComponent(token[2]);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.defaults.axiosInstance = true;

export default axiosInstance;
