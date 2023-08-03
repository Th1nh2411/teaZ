import * as httpRequest from '../utils/httpRequest';

export const login = async (username, password) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        password,
    };
    try {
        const res = await httpRequest.post('account/login', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const register = async (phone, password, name, mail) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        phone,
        password,
        name,
        mail,
    };
    try {
        const res = await httpRequest.post('account/create', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const sendOTP = async (username) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
    };
    try {
        const res = await httpRequest.post('account/forgotpassword', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const confirmOTP = async (username, verifyID) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        verifyID,
    };
    try {
        const res = await httpRequest.post('account/forgotpassword/verify', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const changePassword = async (username, password, repeatPassword) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        password,
        repeatPassword,
    };
    try {
        const res = await httpRequest.post('account/forgotpassword/changePw', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
