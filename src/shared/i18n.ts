import NextI18Next from 'next-i18next';

const nextI18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['zh', 'ja'],
  ns: ['home', 'common', 'squeeze'],
  preload: ['en']
});

export default nextI18Next;

nextI18Next.i18n.languages = nextI18Next.i18n.languages || ['en', 'zh', 'ja'];

/* Optionally, export class methods as named exports */
export const { appWithTranslation, withTranslation, useTranslation } = nextI18Next;
