import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const login = (email, password) =>
  axiosInstances.post(API_PATH.AUTH.LOGIN, { email, password });

export const signup = (name, email, password) =>
  axiosInstances.post(API_PATH.AUTH.SIGNUP, { name, email, password });

export const getProfile = () => axiosInstances.get(API_PATH.AUTH.PROFILE);

export const updateProfile = (data) =>
  axiosInstances.put(API_PATH.AUTH.UPDATE_USER, data);

export const changePassword = (currentPassword, newPassword) =>
  axiosInstances.post(API_PATH.AUTH.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });
