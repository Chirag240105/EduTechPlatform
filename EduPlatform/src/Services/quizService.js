import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const getQuizzesByDocument = (documentId) =>
  axiosInstances.get(API_PATH.QUIZ.BY_DOCUMENT(documentId));

export const getQuizById = (id) => axiosInstances.get(API_PATH.QUIZ.GET(id));

export const submitQuiz = (id, answers) =>
  axiosInstances.post(API_PATH.QUIZ.SUBMIT(id), { answers });

export const deleteQuiz = (id) =>
  axiosInstances.delete(API_PATH.QUIZ.DELETE(id));
