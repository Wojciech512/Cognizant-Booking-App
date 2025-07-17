/**
 * Application environment configuration.
 *
 * Context:
 * - Holds base URLs and feature flags for the current build target.
 * - Swapped out at build time by Angular CLI using file replacements
 *   (e.g., environment.prod.ts for production).
 * - Centralizes all environment-specific settings to avoid hard-coding in services.
 */

export const environment = {
  apiUrl: 'http://localhost:8000/api',
};
