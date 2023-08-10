import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import { HiShoppingBag } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import CartItem from './CartItem';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import Image from '../Image/Image';
import images from '../../assets/images';
import { RiFileWarningLine } from 'react-icons/ri';

const cx = classNames.bind(styles);

function Cart({ data = {}, onCloseModal = () => {}, onDelItem = () => {} }) {
    const localStorageManager = LocalStorageManager.getInstance();
    const navigate = useNavigate();
    const [state, dispatch] = useContext(StoreContext);

    const handleClickCheckout = async () => {
        navigate(config.routes.checkout);
        onCloseModal();
    };
    const handleCheckoutOldInvoice = () => {
        navigate(config.routes.payment, {
            state: { ...state.currentInvoice.invoice, cartInvoice: state.currentInvoice.products },
        });
        onCloseModal();
    };
    return (
        <>
            <Modal
                className={cx('wrapper')}
                handleClickOutside={() => {
                    onCloseModal();
                }}
            >
                <div className={cx('header')}>
                    <div className={cx('left-side')}>
                        <HiShoppingBag className={cx('icon')} />
                        <div className={cx('title')}>
                            Giỏ hàng của bạn (
                            {data.products ? data.products.reduce((total, current) => current.quantity + total, 0) : 0}{' '}
                            món)
                        </div>
                    </div>
                    <AiOutlineClose onClick={onCloseModal} className={cx('close-icon')} />
                </div>
                <div className={cx('body')}>
                    {data && data.products && data.products.length !== 0 ? (
                        data.products.map((item, index) => <CartItem onDelItem={onDelItem} data={item} key={index} />)
                    ) : (
                        <div className={cx('empty-cart-wrapper')}>
                            <Image src={images.emptyCart} className={cx('empty-cart-img')} />
                            <div className={cx('empty-cart-title')}>Không có sản phẩm</div>
                        </div>
                    )}
                </div>
                <div className={cx('footer')}>
                    {state.currentInvoice && state.currentInvoice.invoice ? (
                        <div className={cx('warning-wrapper')}>
                            <div className={cx('warning-title')}>
                                {state.currentInvoice.invoice.status
                                    ? 'Bạn có đơn hàng đang giao'
                                    : 'Bạn có đơn hàng chưa thanh toán'}
                                <RiFileWarningLine className={cx('warning-icon')} />
                            </div>
                            {state.currentInvoice && state.currentInvoice.invoice && (
                                <div onClick={handleCheckoutOldInvoice} className={cx('warning-actions')}>
                                    Chi tiết
                                </div>
                            )}
                        </div>
                    ) : !data.shopStatus ? (
                        <div className={cx('warning-wrapper')}>
                            <div className={cx('warning-title')}>
                                Quán chưa mở cửa
                                <RiFileWarningLine className={cx('warning-icon')} />
                            </div>
                            {state.currentInvoice && state.currentInvoice.invoice && (
                                <div onClick={handleCheckoutOldInvoice} className={cx('warning-actions')}>
                                    Chi tiết
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cx('total')}>
                            <div className={cx('total-title')}>Tổng tiền tạm tính:</div>
                            <div className={cx('total-num')}>{data.total && priceFormat(data.total)}đ</div>
                        </div>
                    )}
                    {data.products && data.products.length !== 0 ? (
                        <Button
                            onClick={handleClickCheckout}
                            disable={!!state.currentInvoice.invoice || !data.shopStatus}
                            primary
                            className={cx('checkout-btn')}
                        >
                            Thanh toán
                        </Button>
                    ) : (
                        <Button onClick={() => onCloseModal()} primary className={cx('checkout-btn')}>
                            Quay lại
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Cart;
