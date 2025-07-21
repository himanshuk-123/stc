import axios from 'axios'

const BASE_URL = 'https://onlinerechargeservice.in/App/webservice'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;