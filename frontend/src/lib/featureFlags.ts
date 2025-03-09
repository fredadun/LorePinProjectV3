/**
 * Feature flags utility for controlling feature availability
 * Reads from environment variables with fallbacks to default values
 */

// Feature flag for social login (Google, Facebook, etc.)
export const ENABLE_SOCIAL_LOGIN = 
  process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true' || true;

// Feature flag for LoreCoins redemption
export const ENABLE_LORECOINS_REDEMPTION = 
  process.env.NEXT_PUBLIC_ENABLE_LORECOINS_REDEMPTION === 'true' || false;

// Feature flag for map view
export const ENABLE_MAP_VIEW = 
  process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === 'true' || true;

// Feature flag for challenge creation
export const ENABLE_CHALLENGE_CREATION = 
  process.env.NEXT_PUBLIC_ENABLE_CHALLENGE_CREATION === 'true' || false;

// Feature flag for profile editing
export const ENABLE_PROFILE_EDITING = 
  process.env.NEXT_PUBLIC_ENABLE_PROFILE_EDITING === 'true' || true;

/**
 * Get the value of a feature flag
 * @param flagName - The name of the feature flag
 * @param defaultValue - The default value if the flag is not found
 * @returns The value of the feature flag
 */
export function getFeatureFlag(flagName: string, defaultValue: boolean = false): boolean {
  const envValue = process.env[`NEXT_PUBLIC_${flagName}`];
  return envValue === 'true' || (envValue === undefined && defaultValue);
}

/**
 * Check if a feature is enabled
 * @param featureName - The name of the feature to check
 * @returns True if the feature is enabled, false otherwise
 */
export function isFeatureEnabled(featureName: string): boolean {
  switch (featureName) {
    case 'SOCIAL_LOGIN':
      return ENABLE_SOCIAL_LOGIN;
    case 'LORECOINS_REDEMPTION':
      return ENABLE_LORECOINS_REDEMPTION;
    case 'MAP_VIEW':
      return ENABLE_MAP_VIEW;
    case 'CHALLENGE_CREATION':
      return ENABLE_CHALLENGE_CREATION;
    case 'PROFILE_EDITING':
      return ENABLE_PROFILE_EDITING;
    default:
      return getFeatureFlag(featureName);
  }
} 