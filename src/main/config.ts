export const DEFAULT_APP_URL = 'https://www.sombrasol.tech';

export interface AppConfig {
  appUrl: string;
  allowedOrigin: string;
}

export function resolveConfig(env: NodeJS.ProcessEnv): AppConfig {
  const override = env.SOMBRASOL_APP_URL?.trim();
  const appUrl = override && override.length > 0 ? override : DEFAULT_APP_URL;
  return { appUrl, allowedOrigin: appUrl };
}
