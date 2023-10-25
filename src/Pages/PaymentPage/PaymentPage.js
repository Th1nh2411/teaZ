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
const cx = classNames.bind(styles);

function CheckoutPage() {
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
            state.showToast('Đặt hàng thành công', 'Vui lòng chờ nhân viên xác nhận đơn');
            const getCurrentInvoice = await state.getCurrentInvoice();
        }
    };
    useEffect(() => {
        if (!state.currentInvoice) {
            state.showToast('Đơn hàng', 'Đơn hàng đã hoàn thành hoặc được huỷ', 'info');
            navigate(config.routes.history);
        }
    }, [state.currentInvoice]);
    useEffect(() => {
        if (paymentStatus === '00') {
            confirmPaymentInvoice();
        } else if (paymentStatus === '02') {
            state.showToast('Thất bại', 'Khách hàng huỷ giao dịch', 'error');
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
            state.showToast('Hủy đơn', results.message);
            dispatch(actions.setCurrentInvoice(null));
            navigate(config.routes.home);
        }
    };
    const orderTime = useMemo(
        () => (invoice && invoice.date ? dayjs(invoice.date).format('HH:mm DD/MM/YYYY') : 'Vừa lên đơn'),
        [],
    );
    return (
        <>
            {showConfirmCancelInvoice && (
                <Modal handleClickOutside={() => setShowConfirmCancelInvoice(false)} className={cx('confirm-wrapper')}>
                    <div className={cx('confirm-title')}>Bạn chắc chắn muốn hủy đơn ?</div>
                    <div className={cx('confirm-actions')}>
                        <Button onClick={() => setShowConfirmCancelInvoice(false)}>Trở lại</Button>
                        <Button onClick={handleCancelInvoice} primary>
                            Xác nhận
                        </Button>
                    </div>
                </Modal>
            )}
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <BillIcon className={cx('title-icon')} />
                    Đơn hàng hiện tại
                </div>
                <div className={cx('body')}>
                    <div className={cx('delivery-section')}>
                        <div className={cx('cart-list-wrapper')}>
                            <div className={cx('body-title')}>Các món đã chọn</div>
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
                                Giao hàng{' '}
                                {invoice && invoice.idShipping_company === 1 ? (
                                    <Image
                                        src={'https://thicao.com/wp-content/uploads/2019/07/logo-moi-cua-grab.jpg'}
                                        className={cx('delivery-company-img')}
                                    />
                                ) : (
                                    <Image
                                        src={
                                            'https://images.squarespace-cdn.com/content/v1/5f9bdbe0209d9a7ee6ea8797/1612706541953-M447AAUK2JK58U0K8B4N/now+food+logo.jpeg'
                                        }
                                        className={cx('delivery-company-img')}
                                    />
                                )}
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
                                                Số điện thoại : {(user && user.phone) || '09999999'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                Thời gian đặt đơn : <span>{orderTime}</span>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                Phí giao hàng : <span>{invoice && priceFormat(invoice.shippingFee)}đ</span>
                            </div>
                            <div className={cx('delivery-subtitle')}>
                                Tổng cộng : <span>{invoice && priceFormat(invoice.total + invoice.shippingFee)}đ</span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('qr-scan-wrapper')}>
                        {invoice && invoice.isPaid === 0 && invoice.paymentMethod === 'Vnpay' ? (
                            <>
                                <div className={cx('qr-scan-title')}>Trạng thái đơn hàng</div>
                                <Image src={images.payment} className={cx('qr-img')} />
                                <div className={cx('actions-wrapper')}>
                                    <div
                                        onClick={() => setShowConfirmCancelInvoice(true)}
                                        className={cx('actions-back')}
                                    >
                                        <RiRefund2Line className={cx('refund-icon')} />
                                        Hủy đơn
                                    </div>
                                    <div onClick={() => paymentVNPay()} className={cx('actions-paid')}>
                                        Thanh toán
                                    </div>
                                </div>
                            </>
                        ) : invoice && invoice.status < 2 ? (
                            <>
                                <div className={cx('qr-scan-title')}>
                                    {!invoice.status ? 'Đơn hàng đang chờ xác nhận' : 'Đơn hàng đang được chuẩn bị'}
                                </div>
                                <Image src={images.barista} className={cx('qr-img')} />
                                {invoice.status === 0 && (
                                    <div className={cx('actions-wrapper')}>
                                        <div
                                            onClick={() => setShowConfirmCancelInvoice(true)}
                                            className={cx('actions-back')}
                                        >
                                            <RiRefund2Line className={cx('refund-icon')} />
                                            Hủy đơn hàng
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={cx('qr-scan-title')}>Đơn hàng đang được giao đến</div>
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
