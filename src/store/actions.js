import {
    SET_CART,
    SET_CURRENT_INVOICE,
    SET_DETAIL_ADDRESS,
    SET_DETAIL_ITEM,
    SET_SHOP_INFO,
    SET_SHOW_LOGIN,
    SET_USER_INFO,
} from './constraints';
export const setUserInfo = (payload) => ({ type: SET_USER_INFO, payload });
export const setShowLogin = (payload) => ({ type: SET_SHOW_LOGIN, payload });
export const setDetailItem = (payload) => ({ type: SET_DETAIL_ITEM, payload });
export const setDetailAddress = (payload) => ({ type: SET_DETAIL_ADDRESS, payload });
export const setCart = (payload) => ({ type: SET_CART, payload });
export const setCurrentInvoice = (payload) => ({ type: SET_CURRENT_INVOICE, payload });
export const setShopInfo = (payload) => ({ type: SET_SHOP_INFO, payload });
