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

const cx = classNames.bind(styles);

function RegisterForm({ onClickChangeForm = () => {} }) {
    const [phone, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState('');
    const [message, setMessage] = useState('');
    const [state, dispatch] = useContext(StoreContext);
    const handleSubmitLogin = (e) => {
        e.preventDefault();

        // fetch api register
        const postRegister = async () => {
            const results = await authService.register(phone, password, name, mail);
            if (results && results.isSuccess) {
                dispatch(
                    actions.setToast({
                        show: true,
                        content: 'Đăng kí thành công',
                        title: 'Đăng kí',
                    }),
                );
                onClickChangeForm();
            } else if (results && results.existMail) {
                setRegisterStatus('ExistMail');
                setMessage(results.message);
            } else {
                setRegisterStatus('ExistPhone');
                setMessage(results.message);
            }
        };
        postRegister();
    };
    const handleChangePhoneValue = (e) => {
        setPhoneNumber(e.target.value);
        setRegisterStatus('');
    };
    const handleChangePasswordValue = (e) => {
        setPassword(e.target.value);
        setRegisterStatus('');
    };
    return (
        <form onSubmit={handleSubmitLogin}>
            <Input
                onChange={handleChangePhoneValue}
                value={phone}
                title="Số điện thoại"
                errorMessage={message}
                errorCondition={registerStatus === 'ExistPhone'}
            />
            <Input
                onChange={(e) => setMail(e.target.value)}
                value={mail}
                type="mail"
                title="Tài khoản gmail"
                errorMessage={message}
                errorCondition={registerStatus === 'ExistMail'}
            />
            <Input onChange={(e) => setName(e.target.value)} value={name} type="text" title="Tên người dùng" />
            <Input
                onChange={handleChangePasswordValue}
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

            <Button className={cx('login-btn')} primary>
                Tạo tài khoản
            </Button>
            <div className={cx('toggle-form')}>
                <span onClick={() => onClickChangeForm()}>Đăng nhập</span>
            </div>
        </form>
    );
}

export default RegisterForm;
