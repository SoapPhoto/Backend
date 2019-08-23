import NextI18Next from 'next-i18next';

const i18Next = new NextI18Next({
  defaultLanguage: 'zh-CN',
  defaultNS: 'common',
  ignoreRoutes: ['/_next/', '/static/', '/api/', '/auth/', '/oauth/', 'graphql/'],
  otherLanguages: ['zh-CN', 'en'],
  localeSubpaths: {
    en: '',
    zh: '',
  },
});

export default i18Next;

export const { i18n, withTranslation, appWithTranslation } = i18Next;
