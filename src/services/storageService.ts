// Firebase Storage Service - File upload/download operations

import { getFirebaseStorage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export const uploadImage = async (
  userId: string,
  folder: string,
  file: { uri: string; name: string; type: string }
): Promise<string> => {
  const storage = getFirebaseStorage();
  
  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const fileName = `${userId}_${timestamp}.${extension}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  // Convert URI to blob
  const response = await fetch(file.uri);
  const blob = await response.blob();
  
  // Upload file
  await uploadBytes(storageRef, blob);
  
  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

export const uploadMultipleImages = async (
  userId: string,
  folder: string,
  files: Array<{ uri: string; name: string; type: string }>
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(userId, folder, file));
  return Promise.all(uploadPromises);
};

export const deleteImage = async (imageURL: string): Promise<void> => {
  const storage = getFirebaseStorage();
  const imageRef = ref(storage, imageURL);
  await deleteObject(imageRef);
};

export const deleteMultipleImages = async (imageURLs: string[]): Promise<void> => {
  const deletePromises = imageURLs.map(url => deleteImage(url));
  await Promise.all(deletePromises);
};

export const getUserFiles = async (userId: string, folder: string): Promise<string[]> => {
  const storage = getFirebaseStorage();
  const folderRef = ref(storage, `${folder}/${userId}`);
  
  try {
    const result = await listAll(folderRef);
    const urlPromises = result.items.map(item => getDownloadURL(item));
    return Promise.all(urlPromises);
  } catch (error) {
    console.log('No files found for user');
    return [];
  }
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop() || '';
};

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
  const extension = getFileExtension(fileName).toLowerCase();
  return imageExtensions.includes(extension);
};

export const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'webm'];
  const extension = getFileExtension(fileName).toLowerCase();
  return videoExtensions.includes(extension);
};

// Upload crop/livestock photo
export const uploadCropPhoto = async (
  userId: string,
  cropId: string,
  file: { uri: string; name: string; type: string }
): Promise<string> => {
  return uploadImage(userId, `crops/${cropId}`, file);
};

// Upload livestock photo
export const uploadLivestockPhoto = async (
  userId: string,
  livestockId: string,
  file: { uri: string; name: string; type: string }
): Promise<string> => {
  return uploadImage(userId, `livestock/${livestockId}`, file);
};

// Upload product photos
export const uploadProductPhotos = async (
  sellerId: string,
  productId: string,
  files: Array<{ uri: string; name: string; type: string }>
): Promise<string[]> => {
  return uploadMultipleImages(sellerId, `products/${productId}`, files);
};

// Upload profile photo
export const uploadProfilePhoto = async (
  userId: string,
  file: { uri: string; name: string; type: string }
): Promise<string> => {
  return uploadImage(userId, 'profiles', file);
};

// Upload post media
export const uploadPostMedia = async (
  userId: string,
  postId: string,
  files: Array<{ uri: string; name: string; type: string }>
): Promise<string[]> => {
  return uploadMultipleImages(userId, `posts/${postId}`, files);
};

// Upload chat attachment
export const uploadChatAttachment = async (
  conversationId: string,
  senderId: string,
  file: { uri: string; name: string; type: string }
): Promise<string> => {
  const timestamp = Date.now();
  const folder = `chat/${conversationId}`;
  return uploadImage(senderId, folder, file);
};