import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        login: {
          email: 'Email',
          password: 'Password',
        },
        register: {
          fullName: 'Full Name',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
        },
      },
    },
  },
});

export default i18n;
