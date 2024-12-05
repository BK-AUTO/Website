import axiosInstance from '@/composables/axios.js';

const URL = '/users';

export default {

  async getUsers(params) {
    const response = await axiosInstance.get(URL, {
      params: params,
    });
    return response.data;
  },
  async getUserById(id) {
    const response = await axiosInstance.get(URL + `/${id}`);
    return response.data;
  },
  async patchUserActivation(id, data) {
    const response = await axiosInstance.patch(URL + `/${id}/activation`, data);
    return response.data;
  },
  async putUser(id, data) {
    const response = await axiosInstance.put(URL + `/${id}`, data);
    return response.data;
  },
  async patchUserPassword(id, data) {
    const response = await axiosInstance.patch(URL + `/${id}/password`, data);
    return response.data;
  }    

};
