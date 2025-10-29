const { baseURL } = require("./BaseURL");

export const getImageUrl = (imageUrl) => {
  // Handle null, undefined, or non-string types
  if (!imageUrl) {
    return null;
  }

  // Convert to string if it's not already
  const urlString = typeof imageUrl === "string" ? imageUrl : String(imageUrl);

  // Check if the imageUrl is empty after trimming
  if (urlString.trim() === "") {
    return null;
  }

  // Check if the imageUrl starts with "http" (already a full URL)
  if (urlString.startsWith("http")) {
    // Even for full URLs, normalize backslashes to forward slashes
    return urlString.replace(/\\/g, "/");
  }

  // Handle relative paths - normalize backslashes to forward slashes
  const normalizedPath = urlString.replace(/\\/g, "/");

  // Ensure the path starts with a forward slash
  const pathWithSlash = normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;

  return `${baseURL}${pathWithSlash}`;
};
