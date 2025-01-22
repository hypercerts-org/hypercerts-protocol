/**
 * Ensures that a required environment variable exists and returns its value
 * @param value The environment variable value
 * @param identifier The name of the environment variable
 * @returns The environment variable value
 * @throws Error if the environment variable is not set
 */
export function requireEnv(value: string | undefined, identifier: string): string {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
}
