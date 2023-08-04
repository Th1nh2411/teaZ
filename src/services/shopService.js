import * as httpRequest from '../utils/httpRequest';

export const getShopInfo = async (latitude = 10.848046, longitude = 106.785888) => {
    const config = {
        params: {
            latitude,
            longitude,
        },
    };
    try {
        const res = await httpRequest.get('shop/getShopInfo', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getItemFromShop = async (idShop, idType) => {
    const config = {
        params: {
            idShop,
            idType,
        },
    };
    try {
        const res = await httpRequest.get('shop/type', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getToppingList = async () => {
    const config = {
        params: {
            idType: 5,
        },
    };
    try {
        const res = await httpRequest.get(`shop/type`, config);
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
