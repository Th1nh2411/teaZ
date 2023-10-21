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
    const [repeatPassword, setRepeatPw] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const editProfile = async () => {
        if (newPassword && newPassword !== repeatPassword) {
            state.showToast('Thất bại', 'Vui lòng điền đúng thông tin', 'error');
            return;
        }
        if (newPassword.length < 6) {
            state.showToast('Thất bại', 'Mật khẩu không ngắn hơn 6 kí tự', 'error');
            return;
        }
        const results = await authService.changePassword({ oldPassword, newPassword, repeatPassword });
        if (results) {
            state.showToast('Thành công', results.message);

            onCloseModal(true);
        }
    };
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setOldPwValue('');
        setPasswordValue('');
        setRepeatPw('');
    };
    const handleClickConfirm = (e) => {
        e.preventDefault();
        editProfile();
    };

    useEffect(() => {
        if (oldPassword !== '' || newPassword !== '' || repeatPassword !== '') {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [newPassword, repeatPassword, oldPassword]);
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
                        setRepeatPw(event.target.value);
                        setValueChange(true);
                    }}
                    errorCondition={newPassword !== repeatPassword && repeatPassword.length !== 0}
                    errorMessage="Xác nhận phải trùng với mật khẩu đã nhập"
                    value={repeatPassword}
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
