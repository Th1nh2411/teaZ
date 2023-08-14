import * as httpRequest from '../utils/httpRequest';

export const create_payment_url = async (body, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.post('order/create_payment_url', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
