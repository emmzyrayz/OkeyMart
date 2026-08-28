import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const encryptData = async (text: string): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/api/encryption/encrypt`, { text });
  return response.data.encrypted;
};

export const decryptData = async (encrypted: string): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/api/encryption/decrypt`, { encrypted });
  return response.data.decrypted;
};