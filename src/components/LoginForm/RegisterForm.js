import styles from './LoginForm.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { onlyNumber, onlyPhoneNumVN, phoneFormat } from '../../utils/format';
import OtpInput from 'react-otp-input';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(styles);

function RegisterForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const postRegister = async (e) => {
        e.preventDefault();
        const results = await authService.register({ phone, password, repeatPassword, name });
        if (results) {
            state.showToast(results.message);

            onClickChangeForm();
        }
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        const res1 = await authService.checkPhone(phone);
        if (res1) {
            const res2 = await authService.sendOTP(phone);
            if (res2) setStep(2);
        }
    };
    const ValidateOTP = async (e) => {
        e.preventDefault();
        if (!otp) return;
        const res = await authService.ValidateOTP(otp);
        if (res) setStep(3);
    };
    const handleChangePhoneValue = (e) => {
        if (onlyNumber(e.target.value)) {
            setPhoneNumber(e.target.value);
        }
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    return (
        <form onSubmit={step === 1 ? sendOTP : step === 2 ? ValidateOTP : postRegister}>
            {step === 1 ? (
                <Input
                    onChange={handleChangePhoneValue}
                    value={phone}
                    title={t('phoneTitle')}
                    errorMessage={t('phoneValidate')}
                    errorCondition={!onlyPhoneNumVN(phone) && phone.length !== 0}
                />
            ) : step === 2 ? (
                <OtpInput
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
                />
            ) : (
                <>
                    <Input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        title={t('userNameTitle')}
                    />
                    <Input
                        onChange={handleChangePasswordValue}
                        value={password}
                        type="password"
                        title={t('passwordTitle')}
                        errorMessage={t('passwordValidate')}
                        errorCondition={password.length < 6 && password.length !== 0}
                    />
                    <Input
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        value={repeatPassword}
                        type="password"
                        title={t('confirmPasswordTitle')}
                        errorMessage={t('confirmPWValidate')}
                        errorCondition={repeatPassword !== password && repeatPassword !== ''}
                    />
                </>
            )}

            <Button className={cx('login-btn')} primary>
                {step === 1 ? t('sendSMS') : step === 2 ? t('confirmSMS') : t('registerTitle')}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>{t('loginTitle')}</span>
            </div>
            <div id="recaptcha-container" className={cx('justify-center flex')}></div>
        </form>
    );
}

export default RegisterForm;
