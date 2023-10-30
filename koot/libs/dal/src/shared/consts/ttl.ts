// Set the time-to-live (TTL) expiration time to 48 hours
export const TTL_EXPIRE_AFTER_AMOUNT = '48h';

// Determine if the TTL index is enabled based on environment variables
export const TTL_INDEX_ENABLED = !(process.env.KOOT_MANAGED_SERVICE === 'true' || process.env.DISABLE_TTL === 'true');

// Function to get TTL options, if TTL indexing is enabled
export function getTTLOptions() {
  if (TTL_INDEX_ENABLED) {
    // Return TTL options with the specified expiration time
    return { expires: TTL_EXPIRE_AFTER_AMOUNT };
  }
  // If TTL indexing is not enabled, return undefined
}