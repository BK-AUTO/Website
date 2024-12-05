import axiosInstance from '@/composables/axios.js';
import { MANAGE_URL_PREFIX } from '@/composables/constants';

const URL = '/contacts';
const MANAGE_URL = MANAGE_URL_PREFIX + URL;

export default {
  async getAllContacts() {
    const response = await axiosInstance.get(MANAGE_URL);
    return response.data;
  },
  async createContact(data) {
    const response = await axiosInstance.post(URL, data);
    return response.data;
  },
  async deleteContact(id) {
    const response = await axiosInstance.delete(MANAGE_URL + `/${id}`);
    return response.data;
  },
};
