const { baseURL } = require("./BaseURL");

export const getImageUrl = (imageUrl) => {
  // Check if the imageUrl is empty
  if (!imageUrl || imageUrl.trim() === "") {
    return null;
  }

  // Check if the imageUrl starts with "http" (already a full URL)
  if (imageUrl.startsWith("http")) {
    // Even for full URLs, normalize backslashes to forward slashes
    return imageUrl.replace(/\\/g, "/");
  }

  // Handle relative paths - normalize backslashes to forward slashes
  const normalizedPath = imageUrl.replace(/\\/g, "/");

  // Ensure the path starts with a forward slash
  const pathWithSlash = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${baseURL}${pathWithSlash}`;
};
