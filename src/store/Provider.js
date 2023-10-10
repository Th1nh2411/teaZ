import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import * as invoiceService from '../services/invoiceService';
import * as cartService from '../services/cartService';

function Provider({ children }) {
    const getCurrentInvoice = async () => {
        const results = await invoiceService.getCurrentInvoice();
        if (results) {
            dispatch(actions.setCurrentInvoice(results));
        }
    };
    const getCurrentCart = async () => {
        const results = await cartService.getCartItem();
        if (results) {
            dispatch(actions.setCart(results));
        }
    };
    const initState = {
        userInfo: null,
        shippingFee: 15,
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
        if (state.userInfo) {
            getCurrentInvoice();
        }
    }, []);
    useEffect(() => {
        if (state.userInfo) {
            getCurrentCart();
        }
    }, [state.userInfo]);
    useEffect(() => {
        if (state.currentInvoice.invoice && state.currentInvoice.invoice.status !== 0) {
            var getCurrentInvoiceInterval = setInterval(() => {
                getCurrentInvoice();
            }, 10000);
        }
        return () => clearInterval(getCurrentInvoiceInterval);
    }, [state.currentInvoice]);
    return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
}

export default Provider;
