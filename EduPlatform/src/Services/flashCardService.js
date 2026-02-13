import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const getAllFlashcardSets = () =>
  axiosInstances.get(API_PATH.FLASHCARD.LIST);

export const getFlashcardsByDocument = (documentId) =>
  axiosInstances.get(API_PATH.FLASHCARD.BY_DOCUMENT(documentId));

export const reviewFlashcard = (cardId) =>
  axiosInstances.post(API_PATH.FLASHCARD.REVIEW(cardId));

export const toggleStarFlashcard = (cardId) =>
  axiosInstances.put(API_PATH.FLASHCARD.TOGGLE_STAR(cardId));

export const deleteFlashcardSet = (id) =>
  axiosInstances.delete(API_PATH.FLASHCARD.DELETE_SET(id));
