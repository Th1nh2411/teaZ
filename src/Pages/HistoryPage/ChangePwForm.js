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

function ChangePwForm({ onCloseModal = () => {} }) {
    const [oldPassword, setOldPwValue] = useState('');
    const [newPassword, setPasswordValue] = useState('');
    const [confirmPw, setConfirmPwValue] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const editProfile = async () => {
        if (newPassword && newPassword !== confirmPw) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Vui lòng điền đúng thông tin',
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
            return;
        }
        if (newPassword.length < 6) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Vui lòng điền đúng thông tin',
                    title: 'Thất bại',
                    type: 'error',
                }),
            );
            return;
        }
        const results = await authService.changePassword({ oldPassword, newPassword });
        if (results && results.isSuccess) {
            dispatch(
                actions.setToast({
                    show: true,
                    content: 'Đổi mật khẩu thành công',
                    title: 'Thành công',
                }),
            );
            onCloseModal(true);
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
        setOldPwValue('');
        setPasswordValue('');
        setConfirmPwValue('');
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        editProfile();
    };

    useEffect(() => {
        if (oldPassword !== '' || newPassword !== '' || confirmPw !== '') {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [newPassword, confirmPw, oldPassword]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>Đổi mật khẩu</div>

            <form onSubmit={handleClickConfirm} className={cx('form')}>
                <Input
                    className={cx('price-input')}
                    onChange={(event) => {
                        setOldPwValue(event.target.value);
                        setValueChange(true);
                    }}
                    value={oldPassword}
                    title="Mật khẩu cũ"
                    type="password"
                />

                <Input
                    required={false}
                    onChange={(event) => {
                        setPasswordValue(event.target.value);
                        setValueChange(true);
                    }}
                    errorCondition={newPassword.length < 6 && newPassword.length !== 0}
                    errorMessage="Mật khẩu phải lớn hơn 6 kí tự"
                    value={newPassword}
                    title="Mật khẩu mới"
                    type="password"
                />
                <Input
                    required={newPassword.length !== 0}
                    onChange={(event) => {
                        setConfirmPwValue(event.target.value);
                        setValueChange(true);
                    }}
                    errorCondition={newPassword !== confirmPw && confirmPw.length !== 0}
                    errorMessage="Xác nhận phải trùng với mật khẩu đã nhập"
                    value={confirmPw}
                    title="Xác nhận mật khẩu"
                    type="password"
                />
                <div className={cx('form-actions')}>
                    {valueChange && <Button onClick={handleCancelEdit}>Đặt lại</Button>}
                    <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                        Đổi mật khẩu
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default ChangePwForm;
