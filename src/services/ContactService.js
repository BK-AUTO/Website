import axiosInstance from '@/composables/axios.js';
import { MANAGE_URL_PREFIX } from '@/composables/constants';

const URL = '/contacts';
const MANAGE_URL = MANAGE_URL_PREFIX + URL;

// Input validation regexes
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

const validateContactData = (data) => {
  const errors = [];

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!data.phone || !PHONE_REGEX.test(data.phone)) {
    errors.push('Valid phone number is required');
  }
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required');
  }

  // Optional fields with validation
  if (data.email && !EMAIL_REGEX.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Length validations
  if (data.name && data.name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  if (data.address && data.address.length > 200) {
    errors.push('Address must be less than 200 characters');
  }
  if (data.message && data.message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }

  return errors;
};

export default {
  async getAllContacts() {
    const response = await axiosInstance.get(MANAGE_URL);
    return response.data;
  },
  
  async createContact(data) {
    // Validate data before sending
    const validationErrors = validateContactData(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Sanitize data before sending
    const sanitizedData = {
      name: (data.name || '').trim(),
      phone: (data.phone || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      address: (data.address || '').trim(),
      message: (data.message || '').trim(),
      _csrf: data._csrf
    };

    const response = await axiosInstance.post(URL, sanitizedData);
    return response.data;
  },
  
  async deleteContact(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid contact ID');
    }
    const response = await axiosInstance.delete(MANAGE_URL + `/${id}`);
    return response.data;
  },
};
