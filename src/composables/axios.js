import axios from 'axios';
import {BASE_URL} from "@/composables/constants.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // Remove Access-Control-Allow-Origin as it should be handled by the server
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Add request interceptor for security headers
axiosInstance.interceptors.request.use((config) => {
    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // Prevent caching of sensitive data
    if (config.method?.toLowerCase() === 'get') {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
    }
    
    return config;
});

export const axiosInstanceMultipart = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
        // Remove Access-Control-Allow-Origin as it should be handled by the server
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Add same security interceptor to multipart instance
axiosInstanceMultipart.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    if (config.method?.toLowerCase() === 'get') {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
    }
    
    return config;
});

axiosInstance.defaults.axiosInstance = true;

export default axiosInstance;
