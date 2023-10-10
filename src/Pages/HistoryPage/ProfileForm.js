import styles from './HistoryPage.module.scss';
import classNames from 'classnames/bind';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import * as authService from '../../services/authService';
import Tippy from '@tippyjs/react';
import { MdOutlineInfo } from 'react-icons/md';
import { onlyNumber } from '../../utils/format';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function ProfileForm({ data, onCloseModal = () => {} }) {
    const [name, setNameValue] = useState(data ? data.name : '');
    const [phone, setPhoneValue] = useState(data ? data.phone : '');
    const [mail, setMailValue] = useState(data ? data.mail : '');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const editProfile = async () => {
        const results = await authService.editProfile({ name, phone, mail });
        if (results && results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Cập nhật thông tin cá nhân thành công',
                    title: 'Thành công',
                }),
            );
            const results2 = await authService.refreshToken(mail);
            if (results2 && results2.isSuccess) {
                dispatch(actions.setUserInfo(results2.userInfo));
            }
            onCloseModal();
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
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setNameValue(data.name);
        setPhoneValue(data.phone);
        setMailValue(data.mail);
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        editProfile();
    };

    useEffect(() => {
        if (data.name !== name || data.phone !== phone || data.mail !== mail) {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [name, phone, mail]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>Cập nhật thông tin cá nhân</div>

            <form onSubmit={handleClickConfirm} className={cx('form')}>
                <Input
                    className={cx('price-input')}
                    onChange={(event) => {
                        setMailValue(event.target.value);
                        setValueChange(true);
                    }}
                    value={mail}
                    title="Tài khoản gmail"
                    type="email"
                />
                <Input
                    onChange={(event) => {
                        setNameValue(event.target.value);
                        setValueChange(true);
                    }}
                    value={name}
                    title="Tên hiển thị"
                    type="text"
                />
                <Input
                    onChange={(event) => {
                        if (onlyNumber(event.target.value)) {
                            setPhoneValue(event.target.value);
                            setValueChange(true);
                        }
                    }}
                    value={phone}
                    title="Số điện thoại"
                    type="text"
                />

                <div className={cx('form-actions')}>
                    {valueChange && <Button onClick={handleCancelEdit}>Đặt lại</Button>}
                    <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                        Cập nhật
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default ProfileForm;
