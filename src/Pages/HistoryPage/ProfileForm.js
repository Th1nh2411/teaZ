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
import Cookies from 'js-cookie';
import OTPInput from 'react-otp-input';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function ProfileForm({ data, onCloseModal = () => {} }) {
    const [name, setNameValue] = useState(data ? data.name : '');
    const [phone, setPhoneValue] = useState(data ? data.phone : '');
    const [valueChange, setValueChange] = useState(false);
    const [state, dispatch] = useContext(StoreContext);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const { t } = useTranslation();
    const editProfile = async () => {
        const results = await authService.editProfile({ name, phone });
        if (results) {
            state.showToast(results.message);
            Cookies.set('userInfo', JSON.stringify({ ...state.userInfo, name, phone }));
            dispatch(actions.setUserInfo({ ...state.userInfo, name, phone }));
            onCloseModal();
        }
    };
    const sendOTP = async (e) => {
        const res1 = await authService.checkPhone(phone);
        if (res1) {
            const res2 = await authService.sendOTP(phone);
            if (res2) setStep(2);
        }
    };
    const ValidateOTP = async (e) => {
        if (!otp) return;
        const res = await authService.ValidateOTP(otp);
        if (res) await editProfile();
    };
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setNameValue(data.name);
        setPhoneValue(data.phone);
    };
    const handleClickConfirm = async (e) => {
        e.preventDefault();
        if (data.phone !== phone) {
            step === 1 ? await sendOTP() : await ValidateOTP();
        } else {
            await editProfile();
        }
    };

    useEffect(() => {
        if (data.name !== name || data.phone !== phone) {
            setValueChange(true);
        } else {
            setValueChange(false);
        }
    }, [name, phone]);
    return (
        <Modal
            handleClickOutside={() => {
                onCloseModal();
            }}
            className={cx('edit-form-wrapper')}
        >
            <div className={cx('form-title')}>{step === 1 ? t('history.updateProfileTitle') : t('confirmSMS')}</div>

            <form onSubmit={handleClickConfirm} className={cx('form')}>
                {step === 1 ? (
                    <>
                        <Input
                            onChange={(event) => {
                                setNameValue(event.target.value);
                                setValueChange(true);
                            }}
                            value={name}
                            title={t('userNameTitle')}
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
                            title={t('phoneTitle')}
                            type="text"
                        />
                    </>
                ) : (
                    <OTPInput
                        containerStyle={{ margin: '10px 0 20px', justifyContent: 'space-between' }}
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
                )}

                <div className={cx('form-actions')}>
                    {valueChange && step === 1 && <Button onClick={handleCancelEdit}> {t('undo')}</Button>}
                    <Button className={cx('confirm-btn')} primary disable={!valueChange}>
                        {step === 1 ? t('update') : t('confirm')}
                    </Button>
                </div>
                <div id="recaptcha-container" className={cx('justify-center flex')}></div>
            </form>
        </Modal>
    );
}

export default ProfileForm;
