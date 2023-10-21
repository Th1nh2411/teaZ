import * as httpRequest from '../utils/httpRequest';

export const create_payment_url = async (body) => {
    try {
        const res = await httpRequest.post('invoice/payment/init', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
