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

const cx = classNames.bind(styles);

function LoginForm({ onCloseModal = () => {} }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [form, setForm] = useState('login');
    const [loginStatus, setLoginStatus] = useState('');
    const [state, dispatch] = useContext(StoreContext);
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api login
        const postLogin = async () => {
            const results = await authService.login(phoneNumber, password);
            if (results) {
                Cookies.set('userInfo', JSON.stringify(results.userInfo));
                dispatch(actions.setUserInfo(results.userInfo));
                state.showToast('Thành công', results.message);
                const getNewInvoice = state.getCurrentInvoice();
                onCloseModal();
            } else {
                setLoginStatus('Số điện thoại hoặc mật khẩu chưa đúng');
                setPassword('');
            }
        };
        postLogin();
    };
    const handleChangePhoneValue = (e) => {
        setPhoneNumber(e.target.value);
        setLoginStatus('');
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
        setLoginStatus('');
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
                {form === 'login' ? 'Đăng nhập' : form === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}{' '}
            </div>
            {form === 'login' ? (
                <form onSubmit={handleSubmitLogin}>
                    <Input onChange={handleChangePhoneValue} value={phoneNumber} title="Số điện thoại" />

                    <Input
                        onChange={handleChangePasswordValue}
                        value={password}
                        title="Mật khẩu"
                        type="password"
                        errorMessage={loginStatus}
                        errorCondition={loginStatus}
                    />

                    <Button className={cx('login-btn')} primary>
                        Đăng nhập
                    </Button>
                    <div className={cx('toggle-form')}>
                        <span
                            onClick={() => {
                                setForm('forgot');
                            }}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>
                    <div className={cx('toggle-form')}>
                        Chưa có tài khoản?{' '}
                        <span
                            onClick={() => {
                                setForm('register');
                            }}
                        >
                            Đăng ký
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
