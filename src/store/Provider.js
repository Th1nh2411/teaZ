import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import LocalStorageManager from '../utils/LocalStorageManager';
import * as invoiceService from '../services/invoiceService';

function Provider({ children }) {
    const localStorageManager = LocalStorageManager.getInstance();
    const getCurrentInvoice = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await invoiceService.getCurrentInvoice(token);
            if (results) {
                dispatch(actions.setCurrentInvoice(results));
            }
        }
    };
    const initState = {
        userInfo: null,
        distance: 0,
        showLogin: false,
        detailItem: { show: false, data: null, editing: false },
        detailAddress: { show: false, address: '' },
        cartData: null,
        currentInvoice: { invoice: null },
        toast: { show: false, content: '', title: '' },
        getCurrentInvoice,
    };
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        getCurrentInvoice();
    }, []);
    useEffect(() => {
        if (state.currentInvoice.invoice && state.currentInvoice.invoice.status !== 0) {
            var getCurrentInvoiceInterval = setInterval(() => {
                getCurrentInvoice();
            }, 10000);
        } else {
            clearInterval(getCurrentInvoiceInterval);
        }
        return () => clearInterval(getCurrentInvoiceInterval);
    }, [state.currentInvoice.invoice]);
    return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
}

export default Provider;
