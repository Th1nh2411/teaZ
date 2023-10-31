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
import { BiBookHeart } from 'react-icons/bi';
import { MdOutlineHistoryEdu } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import { useContext, useEffect, useState } from 'react';

import { StoreContext, actions } from '../../../store';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import i18n from '../../../locales/translation/i18n';
const cx = classNames.bind(styles);

function Header() {
    const [state, dispatch] = useContext(StoreContext);
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const USER_MENU = [
        {
            icon: <MdOutlineHistoryEdu />,
            title: t('header.historyPage'),
            to: config.routes.history,
            type: 'history',
        },
        {
            icon: <BiBookHeart />,
            title: t('header.wishlistPage'),
            to: config.routes.favor,
            type: 'favor',
        },
        {
            icon: <IoLogOutOutline />,
            title: t('header.logout'),
            separate: true,
            type: 'logout',
        },
    ];
    const LANGUAGES_MENU = [
        {
            value: 'VI',
            label: (
                <div className={cx('flag-wrapper')}>
                    <img
                        className={cx('flag-icon')}
                        alt="flag"
                        src="https://cdn-icons-png.flaticon.com/512/323/323319.png"
                    />
                    {t('header.viLg')}
                </div>
            ),
        },
        {
            value: 'EN',
            label: (
                <div className={cx('flag-wrapper')}>
                    <img
                        className={cx('flag-icon')}
                        alt="flag"
                        src="https://cdn-icons-png.flaticon.com/512/197/197374.png"
                    />
                    {t('header.enLg')}
                </div>
            ),
        },
    ];

    const handleOnchangeMenu = (menuItem) => {
        switch (menuItem.type) {
            case 'history':
                //change language
                break;
            case 'logout':
                Cookies.remove('userInfo');
                dispatch(actions.setUserInfo(null));
                dispatch(actions.setCurrentInvoice({}));
                dispatch(actions.setCart(null));
                if (currentPath !== config.routes.home) {
                    navigate(config.routes.home);
                }
                break;
            default:
                console.log('default');
        }
    };
    const onChangeLanguage = (value) => {
        i18n.changeLanguage(value);
        console.log(i18n.language);
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
                        <Select
                            onChange={onChangeLanguage}
                            defaultValue="VI"
                            options={LANGUAGES_MENU}
                            bordered={false}
                            style={{
                                minWidth: 125,
                            }}
                            className="header-select"
                        />
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
                                        <div className={cx('delivery-title')}>{t('header.delivery')}</div>{' '}
                                        <div className={cx('delivery-subtitle')}>{state.detailAddress.address}</div>
                                    </>
                                ) : (
                                    <div className={cx('delivery-no-address')}>{t('header.chooseAddress')}</div>
                                )}
                            </div>
                        </div>
                        <div className={cx('actions')}>
                            {state.userInfo ? (
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
                                    {t('loginTitle')}
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
