import styles from './DetailInvoice.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as invoiceService from '../../services/invoiceService';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { BillIcon } from '../Icons';
import { priceFormat } from '../../utils/format';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function DetailInvoice({ idInvoice, onCloseModal = () => {} }) {
    const [invoiceInfo, setInvoiceInfo] = useState();
    const [invoiceCart, setInvoiceCart] = useState();
    const [loading, setLoading] = useState();
    const localStorageManager = LocalStorageManager.getInstance();
    const getListInvoice = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            setLoading(true);
            const results = await invoiceService.getDetailInvoice(idInvoice, token);
            if (results) {
                setInvoiceInfo(results.invoice);
                setInvoiceCart(results.cart);
            }
            setLoading(false);
        }
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
                <BillIcon height="3rem" width="3rem" className={cx('title-icon')} /> Chi tiết đơn hàng
            </div>
            {loading ? (
                <div className={cx('loader')}>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <div className={cx('body')}>
                    <div className={cx('left-section')}>
                        <div className={cx('body-title')}>Các món đã đặt</div>
                        <div className={cx('cart-list')}>
                            {invoiceCart &&
                                invoiceCart.map((item, index) => (
                                    <div key={index} className={cx('cart-item-wrapper')}>
                                        {/* <Image src={item.image} className={cx('cart-item-img')} /> */}
                                        <div className={cx('cart-item-info')}>
                                            <div className={cx('cart-item-name')}>
                                                {item.name}({item.size ? 'L' : 'M'}) x{item.quantityProduct}
                                            </div>
                                            {item.listTopping.length !== 0 && (
                                                <div className={cx('cart-item-topping')}>
                                                    Topping :{' '}
                                                    {item.listTopping.map((topping) => topping.name).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {invoiceInfo && (
                        <div className={cx('right-section')}>
                            <div className={cx('body-title')}>Thông tin đơn hàng</div>
                            <div className={cx('info')}>
                                Ngày đặt :{' '}
                                <span>
                                    {dayjs(invoiceInfo.date).format('HH:mm')} ngày{' '}
                                    {dayjs(invoiceInfo.date).format('DD/MM/YYYY')}
                                </span>
                            </div>
                            <div className={cx('info')}>
                                Trạng thái :{' '}
                                <span>
                                    {invoiceInfo.status === 0
                                        ? 'Chưa thanh toán'
                                        : invoiceInfo.status === 1
                                        ? 'Đang giao'
                                        : 'Đã giao'}
                                </span>
                            </div>
                            <div className={cx('info')}>
                                Tổng tiền các món : <span>{priceFormat(invoiceInfo.total)}đ</span>
                            </div>
                            <div className={cx('info')}>
                                Phí ship : <span>{priceFormat(invoiceInfo.shippingFee)}đ</span>
                            </div>
                            <div className={cx('info')}>
                                Thành tiền : <span>{priceFormat(invoiceInfo.total + invoiceInfo.shippingFee)}đ</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}

export default DetailInvoice;
