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
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function ChangePwForm({ onCloseModal = () => {} }) {
    const [oldPassword, setOldPwValue] = useState('');
    const [newPassword, setPasswordValue] = useState('');
    const [repeatPassword, setRepeatPw] = useState('');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const editProfile = async () => {
        const results = await authService.changePassword({ oldPassword, newPassword, repeatPassword });
        if (results) {
            state.showToast(results.message);

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
            <div className={cx('form-title')}>{t('changePWTitle')}</div>

            <form onSubmit={handleClickConfirm} className={cx('form')}>
                <Input
                    className={cx('price-input')}
                    onChange={(event) => {
                        setOldPwValue(event.target.value);
                        setValueChange(true);
                    }}
                    value={oldPassword}
                    title={t('oldPasswordTitle')}
                    type="password"
                />

                <Input
                    required={false}
                    onChange={(event) => {
                        setPasswordValue(event.target.value);
                        setValueChange(true);
                    }}
                    errorCondition={newPassword.length < 6 && newPassword.length !== 0}
                    errorMessage={t('passwordValidate')}
                    value={newPassword}
                    title={t('newPasswordTitle')}
                    type="password"
                />
                <Input
                    required={newPassword.length !== 0}
                    onChange={(event) => {
                        setRepeatPw(event.target.value);
                        setValueChange(true);
                    }}
                    errorCondition={newPassword !== repeatPassword && repeatPassword.length !== 0}
                    errorMessage={t('confirmPWValidate')}
                    value={repeatPassword}
                    title={t('confirmPasswordTitle')}
                    type="password"
                />
                <div className={cx('form-actions')}>
                    {valueChange && <Button onClick={handleCancelEdit}>{t('undo')}</Button>}
                    <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                        {t('confirm')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default ChangePwForm;
