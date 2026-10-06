/**
 * Utility helper to resolve image URLs for events, competitions, and gallery items in Admin app.
 * Handles relative '/uploads/' paths from backend server, data URIs, and fallback static images.
 */
export const resolveImageUrl = (imagePath, fallback = '/images/kali_puja.jpg') => {
  if (!imagePath || typeof imagePath !== 'string' || !imagePath.trim()) {
    return fallback;
  }

  const path = imagePath.trim();

  // If it's a data URL or absolute HTTP/HTTPS URL, return as is
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If it's an uploaded file from NestJS backend server
  if (path.startsWith('/uploads/')) {
    return `https://bbsc-api.onrender.com${path}`;
  }

  return path;
};
