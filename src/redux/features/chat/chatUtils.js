// // Utility functions for chat date handling

// /**
//  * Convert a Date object to a timestamp for Redux storage
//  * @param {Date} date - The date to convert
//  * @returns {number} - Timestamp in milliseconds
//  */
// export const dateToTimestamp = (date) => {
//   return date instanceof Date ? date.getTime() : date;
// };

// /**
//  * Convert a timestamp to a Date object for display
//  * @param {number} timestamp - The timestamp to convert
//  * @returns {Date} - Date object
//  */
// export const timestampToDate = (timestamp) => {
//   return new Date(timestamp);
// };

// /**
//  * Get a future date as timestamp (for delivery dates)
//  * @param {number} daysFromNow - Number of days from now
//  * @returns {number} - Timestamp in milliseconds
//  */
// export const getFutureTimestamp = (daysFromNow) => {
//   return Date.now() + (daysFromNow * 24 * 60 * 60 * 1000);
// };

// /**
//  * Format a timestamp for display
//  * @param {number} timestamp - The timestamp to format
//  * @returns {string} - Formatted date string
//  */
// export const formatDeliveryDate = (timestamp) => {
//   const date = timestampToDate(timestamp);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// };
