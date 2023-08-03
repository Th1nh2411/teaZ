import styles from './DetailItem.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import Image from '../Image/Image';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { Col, Form, Row } from 'react-bootstrap';
import LocalStorageManager from '../../utils/LocalStorageManager';
import * as shopService from '../../services/shopService';
import * as cartService from '../../services/cartService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';

const cx = classNames.bind(styles);
const sizeOrders = [
    { price: 0, name: 'Nhỏ' },
    { price: 10, name: 'Lớn ' },
];

function DetailItem({ data = {}, onCloseModal = () => {}, editing = false }) {
    const detailItem = data.Recipe || data;
    const [toppings, setToppings] = useState([]);
    const [num, setNum] = useState(data.quantityProduct || 1);
    const [size, setSize] = useState(data.size || 0);
    const [checkedToppings, setCheckedToppings] = useState(
        data.listTopping ? data.listTopping.map((item) => item.idRecipe) : [],
    );
    const localStorageManager = LocalStorageManager.getInstance();
    const [state, dispatch] = useContext(StoreContext);
    const getToppingList = async (e) => {
        const results = await shopService.getToppingList(detailItem.idRecipe || detailItem.idProduct[1], state.idShop);
        if (results) {
            setToppings(results.listTopping);
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
                const toppingPrice = toppings.find((item) => item.idRecipe === currentId);
                if (toppingPrice) {
                    return toppingPrice.price + total;
                }
            }, 0) || 0;
        return ((detailItem.price * data.discount) / 100 + size + checkedToppingPrice) * num;
    }, [num, size, checkedToppings, toppings]);

    const cart = document.querySelector('#show-cart-btn');
    const cartNum = document.querySelector('#num-item-cart');
    const imageRef = useRef(null);
    const handleEditItemCart = async () => {
        const recipesID = [detailItem.idProduct[1], ...checkedToppings].join(',');
        const token = localStorageManager.getItem('token');
        const results = await cartService.editCartItem(detailItem.idProduct, recipesID, num, size, token);
        onCloseModal(true);
    };
    const handleAddItemCart = () => {
        const token = localStorageManager.getItem('token');

        if (token) {
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

            onCloseModal(true);
            setTimeout(() => {
                flyingItem.remove();
                storeItems();
            }, speed * 1.5);
        } else {
            dispatch(actions.setShowLogin(true));
        }
    };

    const storeItems = async () => {
        const recipesID = [detailItem.idRecipe, ...checkedToppings].join(',');
        const token = localStorageManager.getItem('token');
        const results = await cartService.addItemToCart(recipesID, num, size, token);
        // Change ui Num
        cartNum.classList.add('add-item');
        // cartNum.innerHTML = Number(cartNum.innerHTML) + 1;
    };
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
                        {data.discount !== 100 && (
                            <div className={cx('sale-off')}>
                                <span className={cx('sale-off-percent')}>{100 - data.discount}% OFF</span>
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
                                    {priceFormat((detailItem.price * data.discount) / 100)}₫
                                </div>
                            </div>
                            <div className={cx('order-quantity-wrapper')}>
                                <HiMinusCircle
                                    className={cx('order-minus', { disable: num === 1 })}
                                    onClick={() => {
                                        if (num !== 1) {
                                            setNum((prev) => prev - 1);
                                        }
                                    }}
                                />
                                <div className={cx('order-quantity')}>{num}</div>
                                <HiPlusCircle className={cx('order-add')} onClick={() => setNum((prev) => prev + 1)} />
                            </div>
                        </div>
                        <div className={cx('order-title')}>Chọn size (bắt buộc)</div>
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
                        <div className={cx('order-title')}>Chọn topping (tùy chọn)</div>
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
                                                value={topping.idRecipe}
                                                checked={
                                                    checkedToppings !== [] &&
                                                    checkedToppings.some((item) => item === topping.idRecipe)
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
                    if (editing) {
                        handleEditItemCart();
                    } else {
                        handleAddItemCart();
                    }
                }}
                className={cx('order-add-btn')}
            >
                {priceFormat(total)}₫ - {editing ? 'Cập nhật sản phẩm' : 'Thêm vào giỏ hàng'}
                <MdOutlineAddShoppingCart className={cx('add-icon')} />
            </div>
        </Modal>
    );
}

export default DetailItem;
