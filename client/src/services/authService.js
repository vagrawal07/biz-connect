import axios from "axios";

const API = "http://localhost:5050/api/auth";

const handleAuthResponse = (res) => {
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  return { token, user };
};

export const register = (data) =>
  axios.post(API + "/register", data).then(handleAuthResponse);

export const login = (data) =>
  axios.post(`${API}/login`, data).then(handleAuthResponse);
