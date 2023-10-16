import * as httpRequest from '../utils/httpRequest';

export const getShopInfo = async (latitude = 10.848046, longitude = 106.785888) => {
    try {
        const res = await httpRequest.get('shop');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getShippingFee = async (userLat, userLng, idShipping_company = 1) => {
    const config = {
        params: {
            userLat,
            userLng,
        },
    };

    try {
        const res = await httpRequest.get(`shipping-company/feeship/${idShipping_company}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getItemByType = async (idType) => {
    try {
        const res = await httpRequest.get(`recipe/menu/${idType}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getToppingList = async (idRecipe) => {
    try {
        const res = await httpRequest.get(`recipe/recipe-topping/${idRecipe}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListItem = async (keyword, limit = 5) => {
    const config = {
        params: {
            keyword,
            limit,
        },
    };
    try {
        const res = await httpRequest.get(`recipe/menu`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
