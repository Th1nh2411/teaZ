import * as httpRequest from '../utils/httpRequest';

export const getShippingFee = async (distance, idShipping_company = 1) => {
    const config = {
        params: {
            distance,
            idShipping_company,
        },
    };

    try {
        const res = await httpRequest.get(`order/getShipFee`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const createInvoice = async (idShipping_company = 1, shippingFee, idShop, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = { idShipping_company, shippingFee, idShop };
    try {
        const res = await httpRequest.post(`order/createInvoice`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const confirmInvoice = async (idInvoice, total, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = { idInvoice, total };
    try {
        const res = await httpRequest.put(`order/confirmInvoice`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getCurrentInvoice = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`order/getCurrentInvoice`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const cancelCurrentInvoice = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.del(`order/cancelInvoice`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllInvoice = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`order/getAllInvoice`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getDetailInvoice = async (idInvoice, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`order/getDetailInvoice/${idInvoice}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
