import styles from './DetailItem.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import Image from '../Image/Image';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { Col, Form, Row } from 'react-bootstrap';
import * as shopService from '../../services/shopService';
import * as cartService from '../../services/cartService';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { RiHeartFill, RiHeartAddLine } from 'react-icons/ri';
import { Alert, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function DetailItem({ data = {}, onCloseModal = async () => {}, editing = false }) {
    const detailItem = data;
    const [toppings, setToppings] = useState([]);
    const [quantity, setQuantity] = useState(data.quantity || 1);
    const [size, setSize] = useState(data.size || 0);
    const [isLiked, setIsLiked] = useState(data.isLiked || false);
    const [checkedToppings, setCheckedToppings] = useState(data.toppings ? data.toppings.map((item) => item.id) : []);
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const sizeOrders = [
        { price: 0, name: t('smallSize') },
        { price: 10, name: t('largeSize') },
    ];
    const getToppingList = async (e) => {
        const results = await shopService.getToppingList(data.id);
        if (results) {
            setToppings(results.data);
        }
    };
    useEffect(() => {
        getToppingList();
    }, []);
    const handleChangeToppingCheckBox = (e) => {
        if (e.target.checked) {
            setCheckedToppings([Number(e.target.value), ...checkedToppings]);
        } else {
            const newToppings = checkedToppings.filter((item) => item !== Number(e.target.value));
            setCheckedToppings(newToppings);
        }
    };
    const total = useMemo(() => {
        // Duyệt qua từng phần tử topping đã check, tìm phần tử đã check trong list toppings có cả price và lấy price của phần tử đó cộng vào total
        const checkedToppingPrice =
            checkedToppings.reduce((total, currentId) => {
                const toppingPrice = toppings && toppings.find((item) => item.id === currentId);
                if (toppingPrice) {
                    return toppingPrice.price + total;
                }
            }, 0) || 0;
        return ((detailItem.price * data.discount) / 100 + size + checkedToppingPrice) * quantity;
    }, [quantity, size, checkedToppings, toppings]);

    const cart = document.querySelector('#show-cart-btn');
    const cartNum = document.querySelector('#num-item-cart');
    const imageRef = useRef(null);
    const handleEditItemCart = async () => {
        const productString = [detailItem.id, ...checkedToppings].join(',');
        const results = await cartService.editCartItem(detailItem.productId, { productString, quantity, size });
        if (results) {
            state.showToast(results.message);
        }
        await onCloseModal(true);
    };
    const handleAddItemCart = async () => {
        if (state.userInfo) {
            const speed = 800,
                curveDelay = 300;
            const imageY = imageRef.current.getBoundingClientRect().top,
                imageX = imageRef.current.getBoundingClientRect().left,
                flyingItem = imageRef.current.cloneNode();
            cartNum.classList.remove('add-item');

            flyingItem.classList.add('flyingBtn');
            flyingItem.style.position = 'fixed';
            flyingItem.style.zIndex = '10000000';
            flyingItem.style.top = `${imageY}px`;
            flyingItem.style.left = `${imageX}px`;
            flyingItem.style.opacity = '1';
            flyingItem.style.height = '4rem';
            flyingItem.style.width = '4rem';
            flyingItem.style.transition = `all ${speed / 1000}s ease, top ${(speed + curveDelay) / 1000}s ease, left ${
                speed / 1000
            }s ease, transform ${speed / 1000}s ease ${(speed - 10) / 1000}s`;

            document.body.appendChild(flyingItem);

            flyingItem.style.top = `${cart.offsetTop}px`;
            flyingItem.style.left = `${cart.offsetLeft}px`;
            flyingItem.style.transform = 'scale(0)';

            setTimeout(async () => {
                flyingItem.remove();
                await storeItems();
            }, speed * 1.5);
            await onCloseModal(true);
        } else {
            dispatch(actions.setShowLogin(true));
        }
    };

    const storeItems = async () => {
        const recipesID = [detailItem.id, ...checkedToppings].join(',');
        const results = await cartService.addItemToCart(recipesID, quantity, size);
        if (results) {
            state.showToast(results.message);
        }
        // Change ui Num
        cartNum.classList.add('add-item');
        // cartNum.innerHTML = Number(cartNum.innerHTML) + 1;
    };
    const handleClickFavor = async () => {
        setIsLiked(!isLiked);
        const results = await authService.updateFavor(detailItem.id);
        if (results) {
            state.showToast(results.message);
        }
    };
    const cartQuantity = useMemo(
        () =>
            state.cartData && state.cartData.data
                ? state.cartData.data.reduce((total, current) => current.quantity + total, 0)
                : 0,
        [state.cartData],
    );
    const isReachMax = useMemo(
        () => (data.quantity ? cartQuantity + quantity - data.quantity > 20 : cartQuantity + quantity > 20),
        [quantity, cartQuantity],
    );
    return (
        <Modal
            className={cx('detail-wrapper')}
            handleClickOutside={() => {
                onCloseModal();
            }}
        >
            <Row className={cx('detail-body')}>
                <Col>
                    <div className={cx('order-img-wrapper')}>
                        <Image ref={imageRef} src={detailItem.image} className={cx('order-img')} />
                        {isLiked ? (
                            <Tooltip title={t('unfavorite')}>
                                <RiHeartFill className={cx('heart-icon')} onClick={handleClickFavor} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={t('favorite')}>
                                <RiHeartAddLine className={cx('heart-icon')} onClick={handleClickFavor} />
                            </Tooltip>
                        )}

                        {detailItem.discount !== 100 && (
                            <div className={cx('sale-off')}>
                                <span className={cx('sale-off-percent')}>{100 - detailItem.discount}% OFF</span>
                            </div>
                        )}
                    </div>
                </Col>
                <Col>
                    <div className={cx('order-content-wrapper')}>
                        <div className={cx('order-name')}>{detailItem.name}</div>
                        <div className={cx('order-info')}>{detailItem.info}</div>
                        <div className={cx('order-price-wrapper')}>
                            <div className={cx('order-price-wrapper')}>
                                <div className={cx('order-price')}>{priceFormat(detailItem.price)}₫</div>
                                <div className={cx('order-price-discounted')}>
                                    {priceFormat((detailItem.price * detailItem.discount) / 100)}₫
                                </div>
                            </div>
                            <div className={cx('order-quantity-wrapper')}>
                                <HiMinusCircle
                                    className={cx('order-minus', { disable: quantity === 1 })}
                                    onClick={() => {
                                        if (quantity !== 1) {
                                            setQuantity((prev) => prev - 1);
                                        }
                                    }}
                                />
                                <div className={cx('order-quantity')}>{quantity}</div>
                                <HiPlusCircle
                                    className={cx('order-add', {
                                        disable: isReachMax,
                                    })}
                                    onClick={() => {
                                        if (!isReachMax) {
                                            setQuantity((prev) => prev + 1);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {isReachMax && (
                            <Alert
                                style={{ margin: '15px auto 0px', width: 'fit-content' }}
                                showIcon
                                type="error"
                                message={t('overSizeCart')}
                            />
                        )}
                        <div className={cx('order-title')}>{t('chooseSize')}</div>
                        <div className={cx('order-size-list')}>
                            <Form>
                                <div className="d-flex justify-content-between">
                                    {sizeOrders.map((item, index) => (
                                        <div key={index} className={cx('order-size-item')}>
                                            <Form.Check
                                                value={item.price}
                                                checked={item.price === size}
                                                type="radio"
                                                isValid
                                                name="order-size"
                                                id={`size-${index}`}
                                                onChange={(e) => setSize(Number(e.target.value))}
                                            ></Form.Check>
                                            <label htmlFor={`size-${index}`}>
                                                {item.name} + {item.price ? priceFormat(item.price) : 0}₫
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Form>
                        </div>
                        <div className={cx('order-title')}>{t('chooseTopping')}</div>
                        <div className={cx('order-topping-list')}>
                            {toppings &&
                                toppings.map((topping, index) => (
                                    <label key={index} className={cx('order-topping-item')}>
                                        <div className={cx('order-topping-title')}>{topping.name}</div>
                                        <div className={cx('order-topping-check')}>
                                            <span className={cx('order-topping-price')}>
                                                +{topping.price ? priceFormat(topping.price) : 0}₫
                                            </span>
                                            <Form.Check
                                                value={topping.id}
                                                checked={
                                                    checkedToppings !== [] &&
                                                    checkedToppings.some((item) => item === topping.id)
                                                }
                                                type="checkbox"
                                                isValid
                                                id={`size-${index}`}
                                                onChange={(e) => handleChangeToppingCheckBox(e)}
                                            ></Form.Check>
                                        </div>
                                    </label>
                                ))}
                        </div>
                    </div>
                </Col>
            </Row>

            <div
                onClick={() => {
                    if (!isReachMax) {
                        if (editing) {
                            handleEditItemCart();
                        } else {
                            handleAddItemCart();
                        }
                    }
                }}
                className={cx('order-add-btn', { disable: isReachMax })}
            >
                {priceFormat(total)}₫ - {editing ? t('updateCartItem') : t('addToCart')}
                <MdOutlineAddShoppingCart className={cx('add-icon')} />
            </div>
        </Modal>
    );
}

export default DetailItem;
