import styles from './LoginForm.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import OTPInput from 'react-otp-input';

const cx = classNames.bind(styles);

function ForgotForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhone] = useState('');
    const [newPassword, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [repeatPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const [state, dispatch] = useContext(StoreContext);
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api

        step === 1 ? sendOTP() : step === 2 ? confirmOTP() : changePassword();
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        const res1 = await authService.checkPhone(phone);
        if (res1) {
            const res2 = await authService.sendOTP(phone);
            if (res2) setStep(2);
        }
    };
    const confirmOTP = async (e) => {
        e.preventDefault();
        if (!otp) return;
        const res = await authService.ValidateOTP(otp);
        if (res) setStep(3);
    };
    const changePassword = async () => {
        const results = await authService.changePasswordForgot({ phone, newPassword, repeatPassword });
        if (results) {
            state.showToast('Thành công', results.message);
            onClickChangeForm();
        }
    };

    return (
        <form onSubmit={handleSubmitLogin}>
            {step === 1 && (
                <Input
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                    value={phone}
                    title="Điền số điện thoại đăng ký"
                />
            )}
            {step === 2 && (
                <OTPInput
                    containerStyle={{ margin: '10px 0 20px' }}
                    inputStyle={{
                        textAlign: 'center',
                        border: '1px solid',
                        width: '40px',
                        height: '40px',
                        margin: '0 5px',
                    }}
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                ></OTPInput>
            )}
            {step === 3 && (
                <>
                    <Input
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={newPassword}
                        title="Mật khẩu"
                        type="password"
                        errorMessage={'Mật khẩu phải lớn hơn 6 kí tự'}
                        errorCondition={newPassword.length < 6 && newPassword.length !== 0}
                    />
                    <Input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={repeatPassword}
                        type="password"
                        title="Xác nhận mật khẩu"
                        errorMessage="Xác nhận không trùng với mật khẩu trên"
                        errorCondition={repeatPassword !== newPassword && repeatPassword !== ''}
                    />
                </>
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? 'Gửi OTP đến SDT đăng ký' : step === 2 ? 'Xác nhận mã OTP' : 'Đổi mật khẩu'}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default ForgotForm;
