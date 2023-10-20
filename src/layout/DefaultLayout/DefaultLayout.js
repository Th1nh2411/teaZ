import Header from '../components/Header';
import Footer from '../components/Footer';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import { useContext, useEffect, useMemo, useState } from 'react';
import Cart from '../../components/Cart/Cart';
import { HiShoppingCart } from 'react-icons/hi';
import { BiArrowToTop } from 'react-icons/bi';
import { StoreContext, actions } from '../../store';
import DetailItem from '../../components/DetailItem/DetailItem';
import LoginForm from '../../components/LoginForm/LoginForm';
import Toast from '../../components/Toast/Toast';
import * as cartService from '../../services/cartService';
import config from '../../config';
import { useLocation } from 'react-router';
import DetailChange from '../../components/DetailChange/DetailChange';
import * as mapService from '../../services/mapService';
import * as shopService from '../../services/shopService';
import DetailAddress from '../../components/DetailAddress';
import Cookies from 'js-cookie';
import { setUserInfo } from '../../store/actions';
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    const [showCart, setShowCart] = useState(false);
    const [backToTop, setBackToTop] = useState(false);

    const [location, setLocation] = useState(false);
    const [distance, setDistance] = useState(0);

    const [state, dispatch] = useContext(StoreContext);
    const currentPath = useLocation().pathname;
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                setBackToTop(true);
            } else {
                setBackToTop(false);
            }
        });
    }, []);
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        });
    };

    useEffect(() => {
        getLocation();
    }, []);

    const getDistance = async () => {
        if (location) {
            const results = await shopService.getShippingFee(location.latitude, location.longitude);
            if (results) {
                setDistance(results.distance);
            }
        }
    };
    const getAddress = async () => {
        const results = await mapService.getAddress(location.latitude, location.longitude);
        if (results) {
            dispatch(actions.setDetailAddress({ address: results.display_name, location }));
        }
    };
    const getShopInfo = async () => {
        const results = await shopService.getShopInfo(location.latitude, location.longitude);
        if (results) {
            dispatch(actions.setShopInfo(results.data));
        }
    };

    useEffect(() => {
        getShopInfo();
        getDistance();
        getAddress();
    }, [location]);
    const handleCLickShowCart = () => {
        const userInfo = state.userInfo;
        if (userInfo) {
            setShowCart(true);
        } else {
            dispatch(actions.setShowLogin(true));
        }
    };
    const cartQuantity = useMemo(
        () =>
            state.cartData &&
            state.cartData.data &&
            state.cartData.data.reduce((total, current) => current.quantity + total, 0),
        [state.cartData],
    );
    console.log(state);
    return (
        <>
            <div className={cx('wrapper')}>
                <Header />
                <div className={cx('container')}>
                    <div className={cx('content')}>{children}</div>
                </div>
                <Footer />
            </div>

            {state.toast.show && (
                <Toast
                    content={state.toast.content}
                    title={state.toast.title}
                    type={state.toast.type}
                    onClose={() => dispatch(actions.setToast({ show: false }))}
                />
            )}

            {backToTop && (
                <div onClick={scrollUp} className={cx('back-top-btn')}>
                    <BiArrowToTop />
                </div>
            )}
            {showCart && (
                <Cart
                    cart={state.cartData}
                    onCloseModal={() => setShowCart(false)}
                    onDelItem={async () => {
                        const cart = await state.getCurrentCart();
                    }}
                />
            )}
            {state.detailItem.show && (
                <DetailItem
                    data={state.detailItem.data}
                    onCloseModal={async (editing) => {
                        dispatch(actions.setDetailItem({ show: false, data: {} }));
                        if (editing) {
                            setTimeout(async () => {
                                await state.getCurrentCart();
                            }, [1500]);
                        }
                    }}
                    editing={state.detailItem.editing}
                />
            )}
            {state.detailAddress.show && (
                <DetailAddress
                    data={{ ...location, distance }}
                    onCloseModal={() => {
                        dispatch(actions.setDetailAddress({ show: false }));
                    }}
                    onChangeLocation={(latitude, longitude) => {
                        setLocation({ latitude, longitude });
                    }}
                />
            )}
            {state.showLogin && (
                <LoginForm
                    onCloseModal={() => {
                        dispatch(actions.setShowLogin(false));
                    }}
                />
            )}
            {currentPath !== config.routes.checkout && currentPath !== config.routes.payment && (
                <div id="show-cart-btn" onClick={handleCLickShowCart} className={cx('show-cart-btn')}>
                    <HiShoppingCart />
                    <div id="num-item-cart" className={cx('num-item-cart')}>
                        {cartQuantity || 0}
                    </div>
                </div>
            )}
        </>
    );
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DefaultLayout;
