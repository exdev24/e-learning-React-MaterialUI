import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const baseUrl: string = publicRuntimeConfig.baseUrl;
export const serverPort: number = publicRuntimeConfig.serverPort;

export const segmentOpts: { key: string; enabled: boolean } =
  publicRuntimeConfig.segment;

export const sentryOpts: { dsn: string; enabled: boolean; environment?: string } =
  publicRuntimeConfig.sentry;

export const chatbotOpts: { token: string; enabled: boolean } =
  publicRuntimeConfig.chatbot;
