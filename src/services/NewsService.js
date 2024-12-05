import axiosInstance, { axiosInstanceMultipart } from '@/composables/axios.js';
import { BASE_URL, MANAGE_URL_PREFIX } from '@/composables/constants';
import axios from 'axios';

const URL = '/news';
const MANAGE_URL = MANAGE_URL_PREFIX + URL;

export default {
  async getAllNews() {
    const response = await axiosInstance.get(URL);
    return response.data;
  },
  async getTopNews() {
    const response = await axiosInstance.get(URL + '/top');
    return response.data;
  },
  async getNewsById(id) {
    const response = await axiosInstance.get(URL + `/${id}`);
    return response.data;
  },
  async createNews(data) {
    const response = await axiosInstance.post(MANAGE_URL, data);
    return response.data;
  },
  async uploadImage(id, data) {
    const response = await axiosInstanceMultipart.patch(BASE_URL + MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async putNews(id, data) {
    const response = await axiosInstance.put(MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async deleteNews(id) {
    const response = await axiosInstance.delete(MANAGE_URL + `/${id}`);
    return response.data;
  },
};
