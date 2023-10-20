import {
    SET_CART,
    SET_CURRENT_INVOICE,
    SET_DETAIL_ADDRESS,
    SET_DETAIL_ITEM,
    SET_SHOP_INFO,
    SET_SHOW_LOGIN,
    SET_TOAST,
    SET_USER_INFO,
} from './constraints';

function reducer(state, action) {
    switch (action.type) {
        case SET_USER_INFO:
            return { ...state, userInfo: action.payload };
        case SET_SHOW_LOGIN:
            return { ...state, showLogin: action.payload };
        case SET_DETAIL_ITEM:
            return { ...state, detailItem: action.payload };
        case SET_DETAIL_ADDRESS:
            return { ...state, detailAddress: { ...state.detailAddress, ...action.payload } };
        case SET_CART:
            return { ...state, cartData: action.payload };
        case SET_CURRENT_INVOICE:
            return { ...state, currentInvoice: action.payload };
        case SET_TOAST:
            return { ...state, toast: action.payload };
        case SET_SHOP_INFO:
            return { ...state, shopInfo: action.payload };

        default:
            return state;
    }
}
export default reducer;
