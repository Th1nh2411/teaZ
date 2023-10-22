import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import * as httpRequest from '../utils/httpRequest';
import { authentication } from '../utils/firebase';
import { phoneFormat } from '../utils/format';
import { notification } from 'antd';

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

export const register = async (body) => {
    // const config = {
    //     headers: { access_token: token },
    // };

    try {
        const res = await httpRequest.post('auth/register', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const checkPhone = async (phone) => {
    try {
        const res = await httpRequest.get(`auth/check-phone/${phone}`);
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
export const updateFavor = async (idRecipe) => {
    try {
        const res = await httpRequest.post(`wishlist/${idRecipe}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

const generateCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
            size: 'invisible',
            callback: (response) => {},
        },
        authentication,
    );
};
export const sendOTP = async (phone) => {
    generateCaptcha();
    let appVerifier = window.recaptchaVerifier;
    try {
        const confirmationResult = await signInWithPhoneNumber(authentication, phoneFormat(phone), appVerifier);

        window.confirmationResult = confirmationResult;

        notification.open({
            description: 'Đã gửi mã OTP đến SĐT đăng ký',
            message: 'Gửi SMS',
            placement: 'bottomLeft',
            type: 'success',
        });

        return true;
    } catch (error) {
        notification.open({
            description: error.message ? error.message.replace('_', ' ') : 'Lỗi hệ thống',
            message: 'Send SMS',
            placement: 'bottomLeft',
            type: 'error',
        });

        console.error(error);
    }
};
export const ValidateOTP = async (otp) => {
    try {
        let confirmationResult = window.confirmationResult;
        const result = await confirmationResult.confirm(otp);

        // User signed in successfully.
        notification.open({
            description: 'Xác thực số điện thoại thành công',
            message: 'Xác thực',
            placement: 'bottomLeft',
            type: 'success',
        });

        return true;
    } catch (error) {
        // User couldn't sign in (bad verification code?)
        notification.open({
            description: error.message ? error.message.replace('_', ' ') : 'Lỗi hệ thống',
            message: 'Authenticate',
            placement: 'bottomLeft',
            type: 'error',
        });

        console.error(error);
    }
};
