import api from './axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {}

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};