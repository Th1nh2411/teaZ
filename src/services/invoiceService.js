// import * as httpRequest from '../utils/httpRequest';
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const getShippingCompany = async () => {
    // const config = {

    // };

    try {
        const res = await httpRequest.get(`3b2a1805-cc9a-4948-a36c-b53d7cd6cd00`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getShippingFee = async (distance, idShipping_company = 1) => {
    const config = {
        params: {
            distance,
            idShipping_company,
        },
    };

    try {
        const res = await httpRequest.get(`8aa024dd-97db-4aaf-82d1-436e6cddff09`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const createInvoice = async (idShipping_company = 1, shippingFee, address, payment_status, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = { idShipping_company, shippingFee, address, payment_status };
    try {
        const res = await httpRequest.get(`bed59ccb-8207-492d-ac71-1e6081bb64bf`, body, config);
        return res.data;
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
        const res = await httpRequest.get(`bed59ccb-8207-492d-ac71-1e6081bb64bf`, body, config);
        return res.data;
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
        const res = await httpRequest.get(`bed59ccb-8207-492d-ac71-1e6081bb64bf`, config);
        return res.data;
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
        const res = await httpRequest.get(`bed59ccb-8207-492d-ac71-1e6081bb64bf`, {}, config);
        return res.data;
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
        const res = await httpRequest.get(`0fddc7f4-c5e1-4b0b-9578-6687466f8de7`, config);
        return res.data;
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
        const res = await httpRequest.get(`cd82a73a-25f1-4b58-ad23-05c7f6aab0ca`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
