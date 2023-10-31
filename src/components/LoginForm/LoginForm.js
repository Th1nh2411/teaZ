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
import RegisterForm from './RegisterForm';
import ForgotForm from './ForgotForm';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { onlyPhoneNumVN } from '../../utils/format';

const cx = classNames.bind(styles);

function LoginForm({ onCloseModal = () => {} }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [form, setForm] = useState('login');
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api login
        const postLogin = async () => {
            const results = await authService.login(phoneNumber, password);
            if (results) {
                Cookies.set('userInfo', JSON.stringify(results.userInfo));
                dispatch(actions.setUserInfo(results.userInfo));
                state.showToast(results.message);
                const getNewInvoice = state.getCurrentInvoice();
                onCloseModal();
            }
        };
        postLogin();
    };
    const handleChangePhoneValue = (e) => {
        setPhoneNumber(e.target.value);
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
    };
    return (
        <Modal
            className={cx('wrapper')}
            handleClickOutside={() => {
                onCloseModal();
            }}
        >
            {/* <Image src={images.logo} className={cx('logo')} /> */}
            <div className={cx('title')}>
                {form === 'login' ? t('loginTitle') : form === 'register' ? t('registerTitle') : t('forgotPWTitle')}{' '}
            </div>
            {form === 'login' ? (
                <form onSubmit={handleSubmitLogin}>
                    <Input
                        onChange={handleChangePhoneValue}
                        value={phoneNumber}
                        title={t('phoneTitle')}
                        errorMessage={t('phoneValidate')}
                        errorCondition={!onlyPhoneNumVN(phoneNumber) && phoneNumber.length !== 0}
                    />

                    <Input
                        onChange={handleChangePasswordValue}
                        value={password}
                        title={t('passwordTitle')}
                        type="password"
                    />

                    <Button className={cx('login-btn')} primary>
                        {t('loginTitle')}
                    </Button>
                    <div className={cx('toggle-form')}>
                        <span
                            onClick={() => {
                                setForm('forgot');
                            }}
                        >
                            {t('forgotPWTitle')}
                        </span>
                    </div>
                    <div className={cx('toggle-form')}>
                        {t('noAccount')}{' '}
                        <span
                            onClick={() => {
                                setForm('register');
                            }}
                        >
                            {t('registerTitle')}
                        </span>
                    </div>
                </form>
            ) : form === 'register' ? (
                <RegisterForm onClickChangeForm={() => setForm('login')} />
            ) : (
                <ForgotForm onClickChangeForm={() => setForm('login')} />
            )}
        </Modal>
    );
}

export default memo(LoginForm);
