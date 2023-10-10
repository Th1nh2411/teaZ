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
export const getItemFromShop = async (idType) => {
    try {
        const res = await httpRequest.get(`recipe/menu/${idType}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getToppingList = async (idRecipe) => {
    const config = {
        params: {
            idRecipe,
        },
    };
    try {
        const res = await httpRequest.get(`order/topping`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getSearchResult = async (name, idShop, limit = 5) => {
    const config = {
        params: {
            name,
            limit,
            idShop,
        },
    };
    try {
        const res = await httpRequest.get(`order/search`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
