import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import LocalStorageManager from '../utils/LocalStorageManager';
import * as invoiceService from '../services/invoiceService';
import * as cartService from '../services/cartService';

function Provider({ children }) {
    const localStorageManager = LocalStorageManager.getInstance();
    const getCurrentInvoice = async () => {
        let invoice = localStorageManager.getItem('currentInvoice') || {};
        dispatch(actions.setCurrentInvoice(invoice));
        // const token = localStorageManager.getItem('token');
        // if (token) {
        //     const results = await invoiceService.getCurrentInvoice(token);
        //     if (results) {
        //         dispatch(actions.setCurrentInvoice(results));
        //     }
        // }
    };
    const getCurrentCart = async () => {
        // const token = localStorageManager.getItem('token');
        // if (token) {
        //     const results = await cartService.getCartItem(token);
        //     if (results) {
        //         dispatch(actions.setCart(results));
        //     }
        // }
        let cart = localStorageManager.getItem('cart') || {};
        dispatch(actions.setCart(cart));
    };
    const initState = {
        userInfo: null,
        distance: 0,
        showLogin: false,
        detailItem: { show: false, data: null, editing: false },
        detailAddress: { show: false, address: '' },
        cartData: null,
        currentInvoice: { invoice: undefined },
        toast: { show: false, content: '', title: '' },
        getCurrentCart,
        getCurrentInvoice,
    };
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        getCurrentInvoice();
    }, []);
    useEffect(() => {
        getCurrentCart();
    }, [state.userInfo]);
    // useEffect(() => {
    //     if (state.currentInvoice.invoice && state.currentInvoice.invoice.status !== 0) {
    //         var getCurrentInvoiceInterval = setInterval(() => {
    //             getCurrentInvoice();
    //         }, 10000);
    //     }
    //     return () => clearInterval(getCurrentInvoiceInterval);
    // }, [state.currentInvoice]);
    return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
}

export default Provider;
