import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const getDocuments = () => axiosInstances.get(API_PATH.DOCUMENT.LIST);

export const getDocument = (id) =>
  axiosInstances.get(API_PATH.DOCUMENT.GET(id));

export const uploadDocument = (formData) =>
  axiosInstances.post(API_PATH.DOCUMENT.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument = (id) =>
  axiosInstances.delete(API_PATH.DOCUMENT.DELETE(id));
