import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import images from '../../../assets/images';
import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5';
import Menu from '../../../components/Popper/Menu';
import Image from '../../../components/Image';
import Search from '../Search';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { HiUserCircle } from 'react-icons/hi';
import { MdOutlineHistoryEdu } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import { useContext, useEffect, useState } from 'react';
import LocalStorageManager from '../../../utils/LocalStorageManager';

import { StoreContext, actions } from '../../../store';
const cx = classNames.bind(styles);

function Header() {
    const localStorageManager = LocalStorageManager.getInstance();
    const [state, dispatch] = useContext(StoreContext);
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();
    const USER_MENU = [
        {
            icon: <MdOutlineHistoryEdu />,
            title: 'Lịch sử đặt hàng',
            to: config.routes.history,
            type: 'history',
        },

        {
            icon: <IoLogOutOutline />,
            title: 'Đăng xuất',
            separate: true,
            type: 'logout',
        },
    ];

    const handleOnchangeMenu = (menuItem) => {
        switch (menuItem.type) {
            case 'history':
                //change language
                console.log(menuItem);
                break;
            case 'logout':
                localStorageManager.removeItem('token');
                localStorageManager.removeItem('userInfo');
                dispatch(actions.setUserInfo({}));
                dispatch(actions.setCurrentInvoice({}));
                if (currentPath !== config.routes.home) {
                    navigate(config.routes.home);
                }
                break;
            default:
                console.log('default');
        }
    };

    return (
        <>
            <header className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('side-group')}>
                        <Link to={config.routes.home}>
                            <div className={cx('logo-wrapper')}>
                                <img src={images.logo} className={cx('logo')} alt="logo" />
                            </div>
                        </Link>
                        <Search />
                    </div>
                    <div className={cx('side-group')}>
                        <div
                            onClick={() => {
                                if (currentPath !== config.routes.payment) {
                                    dispatch(actions.setDetailAddress({ show: true }));
                                }
                            }}
                            className={cx('delivery-wrapper')}
                        >
                            <Image
                                className={cx('delivery-img')}
                                src="https://order.phuclong.com.vn/_next/static/images/delivery-686d7142750173aa8bc5f1d11ea195e4.png"
                            />
                            <div className={cx('delivery-body')}>
                                {state.detailAddress.address ? (
                                    <>
                                        <div className={cx('delivery-title')}>Giao hàng</div>{' '}
                                        <div className={cx('delivery-subtitle')}>{state.detailAddress.address}</div>
                                    </>
                                ) : (
                                    <div className={cx('delivery-no-address')}>
                                        Chọn địa chỉ giao, quán để xem chính xác các món ăn
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={cx('actions')}>
                            {localStorageManager.getItem('token') ? (
                                <>
                                    <Menu items={USER_MENU} onChange={handleOnchangeMenu}>
                                        <div className={cx('action-icon')}>
                                            <HiUserCircle />
                                        </div>
                                    </Menu>
                                </>
                            ) : (
                                <Button
                                    onClick={() => dispatch(actions.setShowLogin(true))}
                                    className={cx('login-btn')}
                                    leftIcon={<IoLogInOutline />}
                                >
                                    Đăng nhập
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
