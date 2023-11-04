import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEN from '../en/translation.json';
import translationVI from '../vi/translation.json';
import Cookies from 'js-cookie';

// the translations
const resources = {
    EN: {
        translation: translationEN,
    },
    VI: {
        translation: translationVI,
    },
};

i18n.use(Backend)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: Cookies.get('language') || 'VI',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
