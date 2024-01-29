import axios from "axios";

// registeration

export const registerAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/register",
    {
      email: userData?.email,
      password: userData?.password,
      username: userData?.username,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const checkUserAuthStatusAPI = async () => {
  const response = await axios.get(
    "http://localhost:8090/api/v1/users/auth/check",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const logoutAPI = async () => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/logout",
    {},

    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const getUserProfileAPI = async () => {
  const response = await axios.get(
    "http://localhost:8090/api/v1/users/profile",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
