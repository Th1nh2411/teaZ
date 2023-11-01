import styles from './PaymentPage.module.scss';
import classNames from 'classnames/bind';

import { useLocation, useNavigate } from 'react-router';
import { priceFormat } from '../../utils/format';

import Image from '../../components/Image';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { BillIcon, QRIcon } from '../../components/Icons/Icons';
import * as invoiceService from '../../services/invoiceService';
import * as paymentService from '../../services/paymentService';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StoreContext, actions } from '../../store';
import config from '../../config';
import dayjs from 'dayjs';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import { BsFillPhoneFill } from 'react-icons/bs';
import { RiRefund2Line } from 'react-icons/ri';
import images from '../../assets/images';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(styles);

function CheckoutPage() {
    const { t } = useTranslation();
    const [state, dispatch] = useContext(StoreContext);
    const [showConfirmCancelInvoice, setShowConfirmCancelInvoice] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const paymentStatus = searchParams.get('vnp_TransactionStatus');
    const query = Object.fromEntries(searchParams.entries());
    const navigate = useNavigate();

    const { invoice, products, user } = state.currentInvoice || {};
    const confirmPaymentInvoice = async () => {
        const results = await invoiceService.confirmPayment(query);
        if (results) {
            state.showToast(results.message);
            const getCurrentInvoice = await state.getCurrentInvoice();
        }
    };
    useEffect(() => {
        if (state.currentInvoice === null) {
            state.showToast(t('completedOrderNoti'), '', 'info');
            navigate(config.routes.history);
        }
    }, [state.currentInvoice]);
    useEffect(() => {
        if (paymentStatus === '00') {
            confirmPaymentInvoice();
        } else if (paymentStatus === '02') {
            state.showToast(t('cancelOrderNoti'), '', 'error');
        }
    }, []);

    const paymentVNPay = async () => {
        const results = await paymentService.create_payment_url({
            id_order: state.currentInvoice.invoice.id,
        });
        if (results) {
            window.location.replace(results.data);
        }
    };

    const handleCancelInvoice = async () => {
        const results = await invoiceService.cancelCurrentInvoice(state.currentInvoice.invoice.id);
        if (results) {
            state.showToast(results.message);
            dispatch(actions.setCurrentInvoice(null));
            navigate(config.routes.home);
        }
    };

    return (
        <>
            {showConfirmCancelInvoice && (
                <Modal handleClickOutside={() => setShowConfirmCancelInvoice(false)} className={cx('confirm-wrapper')}>
                    <div className={cx('confirm-title')}>Bạn chắc chắn muốn hủy đơn ?</div>
                    <div className={cx('confirm-actions')}>
                        <Button onClick={() => setShowConfirmCancelInvoice(false)}>{t('return')}</Button>
                        <Button onClick={handleCancelInvoice} primary>
                            Xác nhận
                        </Button>
                    </div>
                </Modal>
            )}
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <BillIcon className={cx('title-icon')} />
                    {t('payment.currentInvoice')}
                </div>
                <div className={cx('body')}>
                    <div className={cx('delivery-section')}>
                        <div className={cx('cart-list-wrapper')}>
                            <div className={cx('body-title')}>{t('itemInOrder')}</div>
                            <div className={cx('cart-list')}>
                                {products &&
                                    products.map((item, index) => (
                                        <div key={index} className={cx('cart-item')}>
                                            <div>
                                                <div className={cx('item-name')}>
                                                    {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                                </div>
                                                <div className={cx('item-topping')}>
                                                    {item.toppings.map((item) => item.name).join(', ')}
                                                </div>
                                            </div>
                                            {item.total && (
                                                <div className={cx('item-price')}>{priceFormat(item.total)}đ</div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className={cx('delivery-wrapper')}>
                            <div className={cx('body-title')}>
                                {t('delivery')}{' '}
                                <Image
                                    src={invoice && invoice.shippingCompany && invoice.shippingCompany.image}
                                    className={cx('delivery-company-img')}
                                />
                            </div>
                            <div className={cx('info')}>
                                <div className={cx('info-body')}>
                                    <IoLocationSharp className={cx('info-icon')} />
                                    <div className={cx('info-detail')}>{user && user.address}</div>
                                </div>
                            </div>
                            <div className={cx('info')}>
                                <div className={cx('info-body')}>
                                    <BsFillPhoneFill className={cx('info-icon')} />
                                    {state.userInfo && (
                                        <div>
                                            <div className={cx('info-title')}>{user && user.name}</div>
                                            <div className={cx('info-detail')}>
                                                {t('phoneTitle')} : {(user && user.phone) || '09999999'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                {t('orderTime')} : <span>{invoice && dayjs(invoice.date).format('HH:mm DD/MM')}</span>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                {t('shippingFee')} : <span>{invoice && priceFormat(invoice.shippingFee)}đ</span>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                {t('totalTitle')} :{' '}
                                <span>{invoice && priceFormat(invoice.total + invoice.shippingFee)}đ</span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('qr-scan-wrapper')}>
                        {invoice && invoice.isPaid === 0 && invoice.paymentMethod === 'Vnpay' ? (
                            <>
                                <div className={cx('qr-scan-title')}>{t('payment.unpaidTitle')}</div>
                                <Image src={images.payment} className={cx('qr-img')} />
                                <div className={cx('actions-wrapper')}>
                                    <div
                                        onClick={() => setShowConfirmCancelInvoice(true)}
                                        className={cx('actions-back')}
                                    >
                                        <RiRefund2Line className={cx('refund-icon')} />
                                        {t('payment.cancelInvoice')}
                                    </div>
                                    <div onClick={() => paymentVNPay()} className={cx('actions-paid')}>
                                        {t('checkout')}
                                    </div>
                                </div>
                            </>
                        ) : invoice && invoice.status < 2 ? (
                            <>
                                <div className={cx('qr-scan-title')}>
                                    {!invoice.status ? t('payment.status0Title') : t('payment.status1Title')}
                                </div>
                                <Image src={images.barista} className={cx('qr-img')} />
                                {invoice.status === 0 && (
                                    <div className={cx('actions-wrapper')}>
                                        <div
                                            onClick={() => setShowConfirmCancelInvoice(true)}
                                            className={cx('actions-back')}
                                        >
                                            <RiRefund2Line className={cx('refund-icon')} />
                                            {t('payment.cancelInvoice')}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={cx('qr-scan-title')}>{t('payment.status2Title')}</div>
                                <Image
                                    src={
                                        'https://order.phuclong.com.vn/_next/static/images/delivery-686d7142750173aa8bc5f1d11ea195e4.png'
                                    }
                                    className={cx('qr-img')}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutPage;
