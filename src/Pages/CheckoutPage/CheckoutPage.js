import styles from './CheckoutPage.module.scss';
import classNames from 'classnames/bind';
import { BsFillClipboard2Fill, BsFillPhoneFill } from 'react-icons/bs';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import * as paymentService from '../../services/paymentService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image/Image';
import { Link, redirect, useNavigate } from 'react-router-dom';
import config from '../../config';
const cx = classNames.bind(styles);

function CheckoutPage() {
    const [checkPolicy, setCheckPolicy] = useState(false);
    const [idShipping_company, setIdShippingCompany] = useState(1);
    const [listCompany, setListCompany] = useState([]);
    const [payment, setPayment] = useState(1);
    const [state, dispatch] = useContext(StoreContext);
    const shippingFee = state.shippingFee;
    const navigate = useNavigate();

    const getShippingCompany = async () => {
        const results = await invoiceService.getShippingCompany();
        if (results) {
            setListCompany(results.shipping_company);
        }
    };
    useEffect(() => {
        getShippingCompany();
    }, []);
    const handleCheckBoxPolicy = (e) => {
        if (e.target.checked) {
            setCheckPolicy(true);
        } else {
            setCheckPolicy(false);
        }
    };
    const handleClickCheckout = async () => {
        const results = await invoiceService.createInvoice(
            idShipping_company,
            shippingFee,
            state.detailAddress.address,
            payment,
        );
        if (results.isSuccess && payment === 1) {
            const results2 = await paymentService.create_payment_url({
                amount: (state.cartData.total + shippingFee).toFixed(3) * 1000,
                bankCode: 'NCB',
                orderId: results.invoice.idInvoice,
            });
            if (results2 && results2.isSuccess) {
                window.location.replace(results2.url);
            }
        } else if (results.isSuccess && payment === 0) {
            dispatch(
                actions.setToast({
                    show: true,
                    title: 'Đặt hàng',
                    content: 'Đặt hàng thành công.',
                }),
            );
            const getCurrentInvoice = await state.getCurrentInvoice();
            navigate(config.routes.payment + '?vnp_TransactionStatus=00');
        } else if (results.runOut) {
            dispatch(
                actions.setToast({
                    show: true,
                    title: 'Đặt hàng',
                    content: 'Giỏ hàng có món đã hết hàng. Vui lòng thay đổi giỏ hàng của bạn',
                    type: 'info',
                }),
            );
            navigate(config.routes.home);
        } else {
            dispatch(
                actions.setToast({
                    show: true,
                    title: 'Đặt hàng thất bại',
                    content: results.message,
                    type: 'info',
                }),
            );
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <BsFillClipboard2Fill className={cx('title-icon')} /> Xác nhận đơn hàng
            </div>
            <div className={cx('body')}>
                <div className={cx('delivery-section')}>
                    <div className={cx('cart-list-wrapper')}>
                        <div className={cx('body-title')}>Các món đã chọn</div>
                        <div className={cx('cart-list')}>
                            {state.cartData &&
                                state.cartData.products.map((item, index) => (
                                    <div key={index} className={cx('cart-item')}>
                                        <div>
                                            <div className={cx('item-name')}>
                                                {item.name}({item.size ? 'L' : 'M'}) x{item.quantity}
                                            </div>
                                            <div className={cx('item-topping')}>
                                                {item.listTopping.map((item) => item.name).join(', ')}
                                            </div>
                                        </div>
                                        <div className={cx('item-price')}>{priceFormat(item.totalProduct)}đ</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className={cx('delivery-wrapper')}>
                        <div className={cx('body-title')}>Giao hàng</div>
                        <div onClick={() => dispatch(actions.setDetailAddress({ show: true }))} className={cx('info')}>
                            <div className={cx('info-body')}>
                                <IoLocationSharp className={cx('info-icon')} />
                                <div className={cx('info-detail')}>{state.detailAddress.address}</div>
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
                                            Số điện thoại : {state.userInfo.phone || '09999999'}
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
                                        value={item.idShipping_company}
                                        checked={idShipping_company === item.idShipping_company}
                                        type="radio"
                                        isValid
                                        id={`com-${index}`}
                                        onChange={(e) => setIdShippingCompany(Number(e.target.value))}
                                    ></Form.Check>
                                    <label htmlFor={`com-${index}`}>
                                        Giao hàng <Image src={item.image} className={cx('delivery-company-img')} />
                                    </label>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={cx('checkout-section')}>
                    <div className={cx('payment-wrapper')}>
                        <div className={cx('body-title')}>Phương thức thanh toán</div>
                        <Form.Select
                            className={cx('payment-select')}
                            size="lg"
                            onChange={(e) => setPayment(Number(e.target.value))}
                        >
                            <option value={1}>Thanh toán VNPAY</option>
                            <option value={0}>Thanh toán khi nhận hàng</option>
                        </Form.Select>
                        {/* {payments.map((item, index) => (
                            <label key={index} htmlFor={`payment-${index}`} className={cx('payment-item')}>
                                <Form.Check
                                    value={item.id}
                                    checked={payment === item.id}
                                    type="radio"
                                    isValid
                                    id={`payment-${index}`}
                                    onChange={(e) => setPayment(Number(e.target.value))}
                                ></Form.Check>
                                <label htmlFor={`payment-${index}`}>
                                    {item.name}
                                    <Image src={item.logo} className={cx('payment-img')} />
                                </label>
                            </label>
                        ))} */}
                    </div>
                    <div className={cx('checkout-wrapper')}>
                        <div className={cx('body-title')}>Hóa đơn thanh toán</div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>Tổng tiền các món</span>{' '}
                            <span className={cx('item-price')}>
                                {state.cartData && priceFormat(state.cartData.total)}đ
                            </span>
                        </div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>Phí vận chuyển</span>{' '}
                            <span className={cx('item-price')}>{priceFormat(shippingFee)}đ</span>
                        </div>
                        <div className={cx('total')}>
                            <span className={cx('item-name')}>Thành tiền</span>{' '}
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
                                Tôi đã đọc, hiểu và đồng ý với tất cả các{' '}
                                <span>điều khoản, điều kiện và chính sách</span> liên quan
                            </div>
                        </div>
                        <Button
                            onClick={handleClickCheckout}
                            className={cx('checkout-btn')}
                            disable={!checkPolicy}
                            primary
                        >
                            Tiến hành thanh toán
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
