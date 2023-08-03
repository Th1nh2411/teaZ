import styles from './CheckoutPage.module.scss';
import classNames from 'classnames/bind';
import { BsFillClipboard2Fill, BsFillPhoneFill } from 'react-icons/bs';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image/Image';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import LocalStorageManager from '../../utils/LocalStorageManager';
const cx = classNames.bind(styles);

const payments = [
    {
        id: 1,
        name: 'MoMo',
        logo: 'https://minio.thecoffeehouse.com/image/tchmobileapp/386_ic_momo@3x.png',
        qrCode: 'https://static.mservice.io/blogscontents/momo-upload-api-211217174745-637753600658721515.png',
    },
    {
        id: 2,
        name: 'ZaloPay',
        logo: 'https://minio.thecoffeehouse.com/image/tchmobileapp/388_ic_zalo@3x.png',
        qrCode: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/348360855_206187095684147_2635888829051936565_n.jpg?stp=dst-jpg_s206x206&_nc_cat=101&ccb=1-7&_nc_sid=aee45a&_nc_ohc=9RsNUFxCOHMAX_lkBCD&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdTTbe7GjqL6joDLxICXrMH3jW3wN7oq6oBjPaNwe39NGA&oe=64A3936B',
    },
    {
        id: 3,
        name: 'ShopeePay',
        logo: 'https://minio.thecoffeehouse.com/image/tchmobileapp/1120_1119_ShopeePay-Horizontal2_O.png',
        qrCode: 'https://treoo.zendesk.com/hc/article_attachments/4403097262361/shopeepay-qr-code.png',
    },
    {
        id: 4,
        name: 'Thẻ ngân hàng',
        logo: 'https://minio.thecoffeehouse.com/image/tchmobileapp/385_ic_atm@3x.png',
        qrCode: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/351805778_631469008880943_2995489567085744667_n.png?stp=dst-png_p206x206&_nc_cat=108&ccb=1-7&_nc_sid=aee45a&_nc_ohc=yedCmHVszGQAX8bv3FB&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdRVIt9ckExtLolb-OBlmx7F0CBxriObb9c-xDibmxwkuQ&oe=64A3A6E7',
    },
];
function CheckoutPage() {
    const [checkPolicy, setCheckPolicy] = useState(false);
    const [idShipping_company, setIdShippingCompany] = useState(1);
    const [payment, setPayment] = useState(1);
    const [shippingFee, setShippingFee] = useState(15);
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManager = LocalStorageManager.getInstance();
    const navigate = useNavigate();
    const getShippingFee = async () => {
        const results = await invoiceService.getShippingFee(state.distance);
        if (results && results.total > 15) {
            setShippingFee(parseInt(results.total));
        }
    };
    useEffect(() => {
        getShippingFee();
    }, [state.distance]);

    const handleCheckBoxPolicy = (e) => {
        if (e.target.checked) {
            setCheckPolicy(true);
        } else {
            setCheckPolicy(false);
        }
    };
    const handleClickCheckout = async () => {
        const token = localStorageManager.getItem('token');
        if (token) {
            const results = await invoiceService.createInvoice(idShipping_company, shippingFee, state.idShop, token);
            if (results.isSuccess) {
                dispatch(actions.setCart(false));
                dispatch(actions.setCurrentInvoice({ cart: [] }));
                const getNewInvoice = state.getCurrentInvoice();
            }
        }
        navigate(config.routes.payment);
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
                                state.cartData.cart.map((item, index) => (
                                    <div key={index} className={cx('cart-item')}>
                                        <div>
                                            <div className={cx('item-name')}>
                                                {item.name}({item.size ? 'L' : 'M'}) x{item.quantityProduct}
                                            </div>
                                            <div className={cx('item-topping')}>
                                                {item.listTopping.map((item) => item.name).join(', ')}
                                            </div>
                                        </div>
                                        <div className={cx('item-price')}>{priceFormat(item.totalProducts)}đ</div>
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
                            <label htmlFor={'com-1'} className={cx('delivery-company-item')}>
                                <Form.Check
                                    value={1}
                                    checked={idShipping_company === 1}
                                    type="radio"
                                    isValid
                                    id={'com-1'}
                                    onChange={(e) => setIdShippingCompany(Number(e.target.value))}
                                ></Form.Check>
                                <label htmlFor={'com-1'}>
                                    Giao hàng{' '}
                                    <Image
                                        src={'https://thicao.com/wp-content/uploads/2019/07/logo-moi-cua-grab.jpg'}
                                        className={cx('delivery-company-img')}
                                    />
                                </label>
                            </label>
                            <label htmlFor={'com-2'} className={cx('delivery-company-item')}>
                                <Form.Check
                                    value={2}
                                    checked={idShipping_company === 2}
                                    type="radio"
                                    isValid
                                    id={'com-2'}
                                    onChange={(e) => setIdShippingCompany(Number(e.target.value))}
                                ></Form.Check>
                                <label htmlFor={'com-2'}>
                                    Giao hàng{' '}
                                    <Image
                                        src={
                                            'https://images.squarespace-cdn.com/content/v1/5f9bdbe0209d9a7ee6ea8797/1612706541953-M447AAUK2JK58U0K8B4N/now+food+logo.jpeg'
                                        }
                                        className={cx('delivery-company-img')}
                                    />
                                </label>
                            </label>
                        </div>
                    </div>
                </div>
                <div className={cx('checkout-section')}>
                    <div className={cx('payment-wrapper')}>
                        <div className={cx('body-title')}>Phương thức thanh toán</div>
                        {payments.map((item, index) => (
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
                        ))}
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
