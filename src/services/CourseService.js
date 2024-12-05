import axiosInstance, { axiosInstanceMultipart } from '@/composables/axios.js';
import { BASE_URL, MANAGE_URL_PREFIX } from '@/composables/constants';
import axios from 'axios';

const URL = '/courses';
const MANAGE_URL = MANAGE_URL_PREFIX + URL;

export default {
  async getAllCourse() {
    const response = await axiosInstance.get(URL);
    return response.data;
  },
  async getTopCourse() {
    const response = await axiosInstance.get(URL + '/top');
    return response.data;
  },
  async getCourseById(id) {
    const response = await axiosInstance.get(URL + `/${id}`);
    return response.data;
  },
  async createCourse(data) {
    const response = await axiosInstance.post(MANAGE_URL, data);
    return response.data;
  },
  async uploadImage(id, data) {
    const response = await axiosInstanceMultipart.patch(BASE_URL + MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async putCourse(id, data) {
    const response = await axiosInstance.put(MANAGE_URL + `/${id}`, data);
    return response.data;
  },
  async deleteCourse(id) {
    const response = await axiosInstance.delete(MANAGE_URL + `/${id}`);
    return response.data;
  },
};
