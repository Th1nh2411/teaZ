import * as httpRequest from '../utils/httpRequest';

export const getCartItem = async (token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get(`cart-product`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const addItemToCart = async (productString = 1, quantity = 1, size = 0, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        productString,
        quantity,
        size,
    };
    try {
        const res = await httpRequest.post('cart-product', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editCartItem = async (idProduct, idRecipe = 1, quantityProduct = 1, sizeProduct = 0, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idRecipe,
        quantityProduct,
        sizeProduct,
    };
    try {
        const res = await httpRequest.patch(`cart-product/${idProduct}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delCartItem = async (idProduct, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.del(`cart-product/${idProduct}`, {}, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delUnavailableItem = async (listIdProduct, token) => {
    const config = {
        headers: { access_token: token },
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
