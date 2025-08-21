const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export const getCloudinaryUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${CLOUDINARY_BASE_URL}${path}`;
};
