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
        const res = await httpRequest.post('account/forgotpassword/changePw', body);
        return res;
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
        const res = await httpRequest.patch('user/editUserInfo', body, config);
        return res;
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
        const res = await httpRequest.put('account/changepassword', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
