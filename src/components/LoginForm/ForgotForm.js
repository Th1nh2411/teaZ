import styles from './LoginForm.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as authService from '../../services/authService';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function ForgotForm({ onClickChangeForm = () => {} }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState(1);

    const [state, dispatch] = useContext(StoreContext);
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api

        status === 1 ? sendOTP() : status === 2 ? confirmOTP() : changePassword();
    };
    const sendOTP = async () => {
        const results = await authService.sendOTP(username);
        if (results && results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
            setStatus(2);
        } else {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
        }
    };
    const confirmOTP = async () => {
        const results = await authService.confirmOTP(username, otp);
        if (results && results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
            setStatus(3);
        } else {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
        }
    };
    const changePassword = async () => {
        const results = await authService.changePassword(username, password, confirmPassword);
        if (results && results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thành công',
                }),
            );
            onClickChangeForm();
        } else {
            dispatch(
                actions.setToast({
                    show: true,
                    content: results.message,
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
        }
    };

    return (
        <form onSubmit={handleSubmitLogin}>
            {status === 1 && (
                <Input
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    value={username}
                    title="Số điện thoại hoặc gmail"
                />
            )}
            {status === 2 && (
                <Input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" title="Mã OTP xác nhận" />
            )}
            {status === 3 && (
                <>
                    <Input
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={password}
                        title="Mật khẩu"
                        type="password"
                        errorMessage={'Mật khẩu phải lớn hơn 6 kí tự'}
                        errorCondition={password.length < 6 && password.length !== 0}
                    />
                    <Input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        type="password"
                        title="Xác nhận mật khẩu"
                        errorMessage="Xác nhận không trùng với mật khẩu trên"
                        errorCondition={confirmPassword !== password && confirmPassword !== ''}
                    />
                </>
            )}

            <Button className={cx('login-btn')} primary>
                {status === 1 ? 'Gửi OTP đến gmail đăng ký' : status === 2 ? 'Xác nhận mã OTP' : 'Đổi mật khẩu'}
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
        </form>
    );
}

export default ForgotForm;
