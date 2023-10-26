import * as httpRequest from '../utils/httpRequest';

export const getCartItem = async () => {
    try {
        const res = await httpRequest.get(`cart-product`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const addItemToCart = async (productString = 1, quantity = 1, size = 0) => {
    const body = {
        productString,
        quantity,
        size,
    };
    try {
        const res = await httpRequest.post('cart-product', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editCartItem = async (idProduct, body) => {
    try {
        const res = await httpRequest.patch(`cart-product/${idProduct}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delCartItem = async (idProduct) => {
    try {
        const res = await httpRequest.del(`cart-product/${idProduct}`, {});
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delUnavailableItem = async (listIdProduct) => {
    const config = {
        data: {
            listIdProduct,
        },
    };

    try {
        const res = await httpRequest.del(`order/deleteProductCart`, {}, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
