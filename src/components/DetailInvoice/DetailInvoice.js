import styles from './DetailInvoice.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as invoiceService from '../../services/invoiceService';
import { BillIcon } from '../Icons';
import { priceFormat } from '../../utils/format';
import dayjs from 'dayjs';
import { Badge } from 'antd';
import config from '../../config';
import { useNavigate } from 'react-router';
import { StoreContext } from '../../store';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function DetailInvoice({ idInvoice, onCloseModal = () => {} }) {
    const navigate = useNavigate();
    const [state, dispatch] = useContext(StoreContext);
    const [invoiceInfo, setInvoiceInfo] = useState();
    const [invoiceCart, setInvoiceCart] = useState();
    const [loading, setLoading] = useState();
    const { t } = useTranslation();
    const getListInvoice = async () => {
        setLoading(true);
        const results = await invoiceService.getDetailInvoice(idInvoice);
        if (results) {
            setInvoiceInfo(results.data.invoice);
            setInvoiceCart(results.data.products);
        }
        setLoading(false);
    };
    const handleCheckoutOldInvoice = () => {
        navigate(config.routes.payment);
        onCloseModal();
    };
    useEffect(() => {
        getListInvoice();
    }, []);
    return (
        <Modal
            className={cx('wrapper')}
            handleClickOutside={() => {
                onCloseModal();
            }}
        >
            <div className={cx('title')}>
                <BillIcon height="3rem" width="3rem" className={cx('title-icon')} /> {t('detailOrder')}
            </div>
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <div className={cx('body')}>
                    <div className={cx('left-section')}>
                        <div className={cx('body-title')}>{t('itemInOrder')}</div>
                        <div className={cx('cart-list')}>
                            {invoiceCart &&
                                invoiceCart.map((item, index) => (
                                    <div key={index} className={cx('cart-item-wrapper')}>
                                        {/* <Image src={item.image} className={cx('cart-item-img')} /> */}
                                        <div className={cx('cart-item-info')}>
                                            <div className={cx('cart-item-name')}>
                                                {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                            </div>
                                            {item.toppings.length !== 0 && (
                                                <div className={cx('cart-item-topping')}>
                                                    Topping : {item.toppings.map((topping) => topping.name).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        <h5 className={cx('cart-item-price')}>{priceFormat(item.price)}đ</h5>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {invoiceInfo && (
                        <div className={cx('right-section')}>
                            <div className={cx('body-title')}>{t('orderInfo')}</div>
                            <div className={cx('info')}>
                                {t('orderDate')} :{' '}
                                <span>{dayjs(invoiceInfo.date).subtract(7, 'hours').format('HH:mm DD/MM/YYYY')}</span>
                            </div>
                            <div className={cx('info')}>
                                {t('statusTitle')} :{' '}
                                <Badge
                                    status={
                                        invoiceInfo.status === 0
                                            ? 'error'
                                            : invoiceInfo.status === 1
                                            ? 'warning'
                                            : invoiceInfo.status === 2
                                            ? 'processing'
                                            : invoiceInfo.status === 3
                                            ? 'success'
                                            : 'default'
                                    }
                                    text={
                                        !invoiceInfo.isPaid && invoiceInfo.paymentMethod === 'Vnpay'
                                            ? t('unpaid')
                                            : invoiceInfo.status === 0
                                            ? t('status0')
                                            : invoiceInfo.status === 1
                                            ? t('status1')
                                            : invoiceInfo.status === 2
                                            ? t('status2')
                                            : invoiceInfo.status === 3
                                            ? t('status3')
                                            : t('status4')
                                    }
                                />
                            </div>
                            <div className={cx('info')}>
                                {t('totalProduct')} : <span>{priceFormat(invoiceInfo.total)}đ</span>
                            </div>
                            <div className={cx('info')}>
                                {t('shippingFee')} : <span>{priceFormat(invoiceInfo.shippingFee)}đ</span>
                            </div>
                            <div className={cx('info')}>
                                {t('totalTitle')} :{' '}
                                <span>{priceFormat(invoiceInfo.total + invoiceInfo.shippingFee)}đ</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {invoiceInfo && invoiceInfo.status < 3 && (
                <Button onClick={handleCheckoutOldInvoice} primary>
                    {t('viewOrderStatus')}
                </Button>
            )}
        </Modal>
    );
}

export default DetailInvoice;
