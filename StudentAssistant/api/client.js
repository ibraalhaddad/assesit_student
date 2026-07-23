import axios from 'axios';

const apiClient = axios.create({
  // استبدل 192.168.8.26 بعنوان الـ IP الخاص بك في حال تغيره
  baseURL: 'http://192.168.137.245:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // زيادة الوقت قليلاً لأن الـ AI قد يستغرق بضع ثوانٍ
});

export default apiClient;