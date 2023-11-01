import styles from './CheckoutPage.module.scss';
import classNames from 'classnames/bind';
import { BsFillClipboard2Fill, BsFillPhoneFill } from 'react-icons/bs';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import * as paymentService from '../../services/paymentService';
import * as shopService from '../../services/shopService';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image/Image';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import TextArea from 'antd/es/input/TextArea';
import Cookies from 'js-cookie';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(styles);

function CheckoutPage() {
    const [checkPolicy, setCheckPolicy] = useState(false);
    const [shippingCompanyId, setIdShippingCompany] = useState(1);
    const [listCompany, setListCompany] = useState([]);
    const [paymentMethod, setPayment] = useState(1);
    const [description, setDescription] = useState('');
    const [state, dispatch] = useContext(StoreContext);
    const [shippingFee, setShippingFee] = useState(15);
    const location = state.detailAddress.location || {};
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getShippingCompany = async () => {
        const results = await invoiceService.getShippingCompany();
        if (results) {
            setListCompany(results.data);
        }
    };
    useEffect(() => {
        getShippingCompany();
    }, []);
    const getShippingFee = async () => {
        const results = await shopService.getShippingFee(location.latitude, location.longitude, shippingCompanyId);
        if (results) {
            setShippingFee(results.data);
        }
    };

    useEffect(() => {
        getShippingFee();
    }, [shippingCompanyId]);
    const handleCheckBoxPolicy = (e) => {
        if (e.target.checked) {
            setCheckPolicy(true);
        } else {
            setCheckPolicy(false);
        }
    };
    const handleClickCheckout = async () => {
        await authService.editProfile({ ...state.userInfo, address: state.detailAddress.address });
        Cookies.set('userInfo', JSON.stringify({ ...state.userInfo, address: state.detailAddress.address }));
        dispatch(actions.setUserInfo({ ...state.userInfo, address: state.detailAddress.address }));
        const results = await invoiceService.createInvoice({
            shippingCompanyId,
            shippingFee,
            paymentMethod: paymentMethod ? 'Vnpay' : 'Thanh toan khi nhan hang',
            description,
        });
        await state.getCurrentInvoice();
        await state.getCurrentCart();
        if (results && paymentMethod === 1) {
            const results2 = await paymentService.create_payment_url({
                id_order: results.data.id,
            });
            if (results2) {
                window.location.replace(results2.data);
            }
        } else if (results && paymentMethod === 0) {
            state.showToast(results.message);

            navigate(config.routes.payment);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <BsFillClipboard2Fill className={cx('title-icon')} /> {t('orderConfirm')}
            </div>
            <div className={cx('body')}>
                <div className={cx('delivery-section')}>
                    <div className={cx('cart-list-wrapper')}>
                        <div className={cx('body-title')}>{t('itemInOrder')}</div>
                        <div className={cx('cart-list')}>
                            {state.cartData &&
                                state.cartData.data &&
                                state.cartData.data.map((item, index) => (
                                    <div key={index} className={cx('cart-item')}>
                                        <div>
                                            <div className={cx('item-name')}>
                                                {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                            </div>
                                            <div className={cx('item-topping')}>
                                                {item.toppings.map((item) => item.name).join(', ')}
                                            </div>
                                        </div>
                                        <div className={cx('item-price')}>{priceFormat(item.price)}đ</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className={cx('delivery-wrapper')}>
                        <div className={cx('body-title')}>{t('delivery')}</div>
                        <div onClick={() => dispatch(actions.setDetailAddress({ show: true }))} className={cx('info')}>
                            <div className={cx('info-body')}>
                                <IoLocationSharp className={cx('info-icon')} />
                                {state.detailAddress.address ? (
                                    <div className={cx('info-detail')}>{state.detailAddress.address}</div>
                                ) : (
                                    <Alert showIcon type="error" message={t('addressValidate')} />
                                )}
                            </div>
                            <AiOutlineRight className={cx('info-actions')} />
                        </div>
                        <div className={cx('info')}>
                            <div className={cx('info-body')}>
                                <BsFillPhoneFill className={cx('info-icon')} />
                                {state.userInfo && (
                                    <div>
                                        <div className={cx('info-title')}>{state.userInfo.name}</div>
                                        <div className={cx('info-detail')}>
                                            {t('phoneTitle')} : {state.userInfo.phone || '09999999'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <AiOutlineRight className={cx('info-actions')} />
                        </div>
                        <div className={cx('info')}>
                            {listCompany.map((item, index) => (
                                <label key={index} htmlFor={`com-${index}`} className={cx('delivery-company-item')}>
                                    <Form.Check
                                        value={item.id}
                                        checked={shippingCompanyId === item.id}
                                        type="radio"
                                        isValid
                                        id={`com-${index}`}
                                        onChange={(e) => setIdShippingCompany(Number(e.target.value))}
                                    ></Form.Check>
                                    <label htmlFor={`com-${index}`}>
                                        {t('delivery')}{' '}
                                        <Image src={item.image} className={cx('delivery-company-img')} />
                                    </label>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={cx('checkout-section')}>
                    <div className={cx('payment-wrapper')}>
                        <div className={cx('body-title')}>{t('paymentMethods')}</div>
                        <Form.Select
                            className={cx('payment-select')}
                            size="lg"
                            onChange={(e) => setPayment(Number(e.target.value))}
                        >
                            <option value={1}>{t('paymentVNPAY')}</option>
                            <option value={0}>{t('paymentOnDelivery')}</option>
                        </Form.Select>
                    </div>
                    <div className={cx('description-wrapper', 'mt-4')}>
                        <div className={cx('body-title')}>{t('note')}</div>
                        <TextArea
                            placeholder={t('note')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className={cx('checkout-wrapper')}>
                        <div className={cx('body-title')}>{t('billDesc')}</div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>{t('totalProduct')}</span>{' '}
                            <span className={cx('item-price')}>
                                {state.cartData && priceFormat(state.cartData.total)}đ
                            </span>
                        </div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>{t('shippingFee')}</span>{' '}
                            <span className={cx('item-price')}>{priceFormat(shippingFee)}đ</span>
                        </div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>{t('totalTitle')}</span>{' '}
                            <span className={cx('item-price-final')}>
                                {state.cartData && priceFormat(state.cartData.total + shippingFee)}đ
                            </span>
                        </div>
                        <div className={cx('policy-wrapper')}>
                            <Form.Check
                                className={cx('policy-check')}
                                checked={checkPolicy}
                                type="checkbox"
                                isValid
                                onChange={(e) => handleCheckBoxPolicy(e)}
                            />
                            <div className={cx('policy-title')}>
                                {t('policyAgree')} <span>{t('policyTitle')}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleClickCheckout}
                            className={cx('checkout-btn')}
                            disable={!checkPolicy || !state.detailAddress.address}
                            primary
                        >
                            {t('checkout')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
