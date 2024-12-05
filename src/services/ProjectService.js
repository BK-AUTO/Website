import axiosInstance, { axiosInstanceMultipart } from '@/composables/axios.js';
import { BASE_URL, MANAGE_URL_PREFIX } from '@/composables/constants';
import axios from 'axios';

const URL = '/projects';
const MANAGE_URL = MANAGE_URL_PREFIX + URL;

export default {
  async getAllProject() {
    const response = await axiosInstance.get(URL);
    return response.data;
  },
  async getTopProject() {
    const response = await axiosInstance.get(URL + '/top');	
    return response.data;
  },
  async getProjectById(id) {
    const response = await axiosInstance.get(URL + `/${id}`);
    return response.data;
  },
  async createProject(data) {
    const response = await axiosInstance.post(MANAGE_URL, data);
    return response.data;
  },
  async uploadImage(id, data) {
    const response = await axiosInstanceMultipart.patch(BASE_URL + MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async putProject(id, data) {
    const response = await axiosInstance.put(MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async deleteProject(id) {
    const response = await axiosInstance.delete(MANAGE_URL + `/${id}`);
    return response.data;
  },
};
