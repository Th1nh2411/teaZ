import * as httpRequest from '../utils/httpRequest';

export const getCartItem = async (token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get(`order/currentCart`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const addItemToCart = async (idRecipe = 1, quantityProduct = 1, sizeProduct = 0, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idRecipe,
        quantityProduct,
        sizeProduct,
    };
    try {
        const res = await httpRequest.post('order/addToCart', body, config);
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
        const res = await httpRequest.post(`order/editProductCart/${idProduct}`, body, config);
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
        const res = await httpRequest.del(`order/deleteProductCart/${idProduct}`, {}, config);
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
