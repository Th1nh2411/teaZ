import * as httpRequest from '../utils/httpRequest';

export const login = async (phone, password) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        phone,
        password,
    };
    try {
        const res = await httpRequest.post('auth/login', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const register = async (phone, password, name) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        phone,
        password,
        name,
    };
    try {
        const res = await httpRequest.post('auth/register', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const uploadFile = async (my_file) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const body = {
        my_file,
    };
    try {
        const res = await httpRequest.post(`auth/upload`, body, config);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const changePasswordForgot = async (body) => {
    // const config = {
    //     headers: { access_token: token },
    // };

    try {
        const res = await httpRequest.post('auth/forgotpassword', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editProfile = async (body) => {
    try {
        const res = await httpRequest.patch('auth/profile', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const changePassword = async (body) => {
    try {
        const res = await httpRequest.post('auth/changepassword', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getWishListItem = async () => {
    try {
        const res = await httpRequest.get('wishlist');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
