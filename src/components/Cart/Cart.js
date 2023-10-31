import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import { HiShoppingBag } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import CartItem from './CartItem';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import Image from '../Image/Image';
import images from '../../assets/images';
import { RiFileWarningLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function Cart({ onCloseModal = () => {}, onDelItem = () => {} }) {
    const navigate = useNavigate();
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();

    const handleClickCheckout = async () => {
        navigate(config.routes.checkout);
        onCloseModal();
    };
    const handleCheckoutOldInvoice = () => {
        navigate(config.routes.payment);
        onCloseModal();
    };
    const cartData = state.cartData && state.cartData.data;
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
                            {t('yourCart')} (
                            {cartData ? cartData.reduce((total, current) => current.quantity + total, 0) : 0}{' '}
                            {t('item')})
                        </div>
                    </div>
                    <AiOutlineClose onClick={onCloseModal} className={cx('close-icon')} />
                </div>
                <div className={cx('body')}>
                    {cartData && cartData.length !== 0 ? (
                        cartData.map((item, index) => <CartItem onDelItem={onDelItem} data={item} key={index} />)
                    ) : (
                        <div className={cx('empty-cart-wrapper')}>
                            <Image src={images.emptyCart} className={cx('empty-cart-img')} />
                            <div className={cx('empty-cart-title')}>{t('emptyProduct')}</div>
                        </div>
                    )}
                </div>
                <div className={cx('footer')}>
                    {state.currentInvoice && state.currentInvoice.invoice ? (
                        <div className={cx('warning-wrapper')}>
                            <div className={cx('warning-title')}>
                                {state.currentInvoice.invoice.status
                                    ? t('incompleteInvoiceAlert')
                                    : t('unpaidBillAlert')}
                                <RiFileWarningLine className={cx('warning-icon')} />
                            </div>
                            {state.currentInvoice && state.currentInvoice.invoice && (
                                <div onClick={handleCheckoutOldInvoice} className={cx('warning-actions')}>
                                    {t('detail')}
                                </div>
                            )}
                        </div>
                    ) : !state.shopInfo.isActive ? (
                        <div className={cx('warning-wrapper')}>
                            <div className={cx('warning-title')}>
                                {t('inactiveShop')}
                                <RiFileWarningLine className={cx('warning-icon')} />
                            </div>
                            {state.currentInvoice && state.currentInvoice.invoice && (
                                <div onClick={handleCheckoutOldInvoice} className={cx('warning-actions')}>
                                    {t('detail')}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cx('total')}>
                            <div className={cx('total-title')}>{t('totalCart')}:</div>
                            <div className={cx('total-num')}>
                                {state.cartData.total ? priceFormat(state.cartData.total) : 0}đ
                            </div>
                        </div>
                    )}
                    {cartData && cartData.length !== 0 ? (
                        <Button
                            onClick={handleClickCheckout}
                            disable={!!state.currentInvoice || !state.shopInfo.isActive}
                            primary
                            className={cx('checkout-btn')}
                        >
                            {t('checkout')}
                        </Button>
                    ) : (
                        <Button onClick={() => onCloseModal()} primary className={cx('checkout-btn')}>
                            {t('return')}
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Cart;
