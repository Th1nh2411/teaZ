import * as httpRequest from '../utils/httpRequest';

export const getShippingCompany = async () => {
    // const config = {

    // };

    try {
        const res = await httpRequest.get(`shipping-company`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createInvoice = async (idShipping_company = 1, shippingFee, address, payment_status, token) => {
    const body = { idShipping_company, shippingFee, address, payment_status };
    try {
        const res = await httpRequest.post(`invoice/checkout`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const confirmInvoice = async (idInvoice, total, token) => {
    const body = { idInvoice, total };
    try {
        const res = await httpRequest.put(`order/confirmInvoice`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getCurrentInvoice = async (token) => {
    try {
        const res = await httpRequest.get(`invoice/current/get`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const cancelCurrentInvoice = async (token) => {
    try {
        const res = await httpRequest.del(`order/cancelInvoice`, {});
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllInvoice = async (token) => {
    try {
        const res = await httpRequest.get(`invoice`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getDetailInvoice = async (idInvoice, token) => {
    try {
        const res = await httpRequest.get(`invoice/${idInvoice}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
