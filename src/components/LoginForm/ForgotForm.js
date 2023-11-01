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
import { onlyPhoneNumVN } from '../../utils/format';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function ForgotForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhone] = useState('');
    const [newPassword, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [repeatPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const handleSubmit = (e) => {
        e.preventDefault();

        // fetch api

        step === 1 ? sendOTP() : step === 2 ? confirmOTP() : changePassword();
    };

    const sendOTP = async () => {
        if (!onlyPhoneNumVN(phone) && phone.length !== 0) {
            return;
        }
        const res = await authService.sendOTP(phone);
        if (res) setStep(2);
    };
    const confirmOTP = async () => {
        if (!otp) return;
        const res = await authService.ValidateOTP(otp);
        if (res) setStep(3);
    };
    const changePassword = async () => {
        if (
            (newPassword.length < 6 && newPassword.length !== 0) ||
            (repeatPassword !== newPassword && repeatPassword !== '')
        ) {
            return;
        }
        const results = await authService.changePasswordForgot({ phone, newPassword, repeatPassword });
        if (results) {
            state.showToast(results.message);
            onClickChangeForm();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {step === 1 && (
                <Input
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                    value={phone}
                    title={t('phoneTitle')}
                    errorMessage={t('phoneValidate')}
                    errorCondition={!onlyPhoneNumVN(phone) && phone.length !== 0}
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
                        type="password"
                        title={t('newPasswordTitle')}
                        errorMessage={t('passwordValidate')}
                        errorCondition={newPassword.length < 6 && newPassword.length !== 0}
                    />
                    <Input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={repeatPassword}
                        type="password"
                        title={t('confirmPasswordTitle')}
                        errorMessage={t('confirmPWValidate')}
                        errorCondition={repeatPassword !== newPassword && repeatPassword !== ''}
                    />
                </>
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? t('sendSMS') : step === 2 ? t('confirmSMS') : t('changePWTitle')}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>{t('loginTitle')}</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default ForgotForm;
