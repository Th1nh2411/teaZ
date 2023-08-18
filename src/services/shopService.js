// import * as httpRequest from '../utils/httpRequest';
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const getShopInfo = async (latitude = 10.848046, longitude = 106.785888) => {
    const config = {
        params: {
            latitude,
            longitude,
        },
    };
    try {
        const res = await httpRequest.get('8a3165d3-2789-46fa-b5ab-13ee0fd74de8', config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getItemFromShop = async (idType) => {
    const config = {
        params: {
            idType,
        },
    };
    try {
        const res = await httpRequest.get('aa790e39-70d5-464e-a7e9-71f4d478a915', config);
        return res.data;
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
        const res = await httpRequest.get(`386a877a-b97d-4a3f-ae46-a0c4bcd53532`, config);
        return res.data;
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
        const res = await httpRequest.get(`49ab28d8-fd99-4d30-88fd-2e620fc83f2d`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
