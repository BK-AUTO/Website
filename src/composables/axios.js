import axios from 'axios';
import {BASE_URL} from "@/composables/constants.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
});

// Basic request interceptor
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

export const axiosInstanceMultipart = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

// Basic request interceptor for multipart instance
axiosInstanceMultipart.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosInstance.defaults.axiosInstance = true;

export default axiosInstance;
