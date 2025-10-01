import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (username, password) => {
  const response = await api.post('/token', {
    username: username,
    password: password
  });
  return response.data;
};

export const getConfigs = async (filters = {}, token) => {
  const response = await api.get('/configs/', {
    params: filters,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createConfig = async (config, token) => {
  const response = await api.post('/configs/', config, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateConfig = async (id, config, token) => {
  const response = await api.put(`/configs/${id}`, config, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteConfig = async (id, token) => {
  await api.delete(`/configs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Função para criar usuário inicial (usar apenas uma vez)
export const createUser = async (userData) => {
  const response = await api.post('/users/', userData);
  return response.data;
};