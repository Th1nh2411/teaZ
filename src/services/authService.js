// import * as httpRequest from '../utils/httpRequest';
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const login = async (username, password) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        password,
    };
    try {
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const refreshToken = async (username) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
    };
    try {
        const res = await httpRequest.post('account/refreshToken', body);
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
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body);
        return res.data;
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
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body);
        return res.data;
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
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const changePasswordForgot = async (username, password, repeatPassword) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        password,
        repeatPassword,
    };
    try {
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editProfile = async (body, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const changePassword = async (body, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get('93162a4b-1b23-49bb-9989-367fe0ae9813', body, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
