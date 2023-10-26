import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import * as invoiceService from '../services/invoiceService';
import * as cartService from '../services/cartService';
import Cookies from 'js-cookie';
import { notification } from 'antd';

function Provider({ children }) {
    const getCurrentInvoice = async () => {
        const results = await invoiceService.getCurrentInvoice();
        if (results) {
            dispatch(actions.setCurrentInvoice(results.data));
        }
    };
    const [api, contextHolder] = notification.useNotification();
    const showToast = (message = '', description = '', type = 'success') => {
        api[type]({
            message,
            description,
            placement: 'bottomLeft',
        });
    };
    const getCurrentCart = async () => {
        const results = await cartService.getCartItem();
        if (results) {
            dispatch(actions.setCart(results));
        }
    };
    const initState = {
        userInfo: JSON.parse(Cookies.get('userInfo') || null),
        showLogin: false,
        detailItem: { show: false, data: null, editing: false },
        detailAddress: { show: false, address: '' },
        showToast,
        shopInfo: {},
        currentInvoice: 0,
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
        if (state.currentInvoice && state.currentInvoice.status !== 0) {
            var getCurrentInvoiceInterval = setInterval(() => {
                getCurrentInvoice();
            }, 10000);
        }
        return () => clearInterval(getCurrentInvoiceInterval);
    }, [state.currentInvoice]);
    return (
        <UserContext.Provider value={[state, dispatch]}>
            {contextHolder}
            {children}
        </UserContext.Provider>
    );
}

export default Provider;
