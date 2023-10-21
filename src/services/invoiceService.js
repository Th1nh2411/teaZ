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

export const createInvoice = async (body) => {
    try {
        const res = await httpRequest.post(`invoice/checkout`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const confirmPayment = async (params) => {
    const config = { params };
    try {
        const res = await httpRequest.get(`invoice/payment/return`, config);
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
export const cancelCurrentInvoice = async (idInvoice) => {
    try {
        const res = await httpRequest.del(`invoice/cancel/${idInvoice}`);
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
