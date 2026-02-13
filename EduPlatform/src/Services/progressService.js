import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const getProgress = () =>
  axiosInstances.get(API_PATH.PROGRESS.GET);
