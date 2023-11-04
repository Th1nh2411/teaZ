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
import { MdOutlineClose, MdOutlineHistoryEdu, MdOutlineMenu } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import { useContext, useEffect, useRef, useState } from 'react';

import { StoreContext, actions } from '../../../store';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Avatar, Divider, Dropdown, Select } from 'antd';
import i18n from '../../../locales/translation/i18n';
const cx = classNames.bind(styles);

function Header() {
    const [state, dispatch] = useContext(StoreContext);
    const [showMenuMb, setShowMenuMb] = useState(false);
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const overlayRef = useRef();
    const handleDocumentClick = (event) => {
        if (overlayRef.current && overlayRef.current.contains(event.target)) {
            setShowMenuMb(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleShowMenuMb = () => {
        setShowMenuMb(!showMenuMb);
    };
    const handleCloseMenuMb = () => {
        setShowMenuMb(false);
    };
    const USER_MENU = [
        {
            icon: <MdOutlineHistoryEdu style={{ fontSize: 20 }} />,
            label: <span style={{ fontSize: 16 }}>{t('header.historyPage')}</span>,
            key: 1,
        },
        {
            icon: <BiBookHeart style={{ fontSize: 20 }} />,
            label: <span style={{ fontSize: 16 }}> {t('wishlist')}</span>,
            key: 2,
        },
        {
            type: 'divider',
        },
        {
            icon: <IoLogOutOutline style={{ fontSize: 20 }} />,
            label: <span style={{ fontSize: 16 }}>{t('header.logout')}</span>,
            key: 3,
        },
    ];

    const handleOnchangeMenu = ({ key }) => {
        console.log(key);
        switch (key) {
            case '1':
                navigate(config.routes.history);
                break;
            case '2':
                navigate(config.routes.favor);
                break;
            case '3':
                handleLogOut();
                break;
            default:
                console.log('default');
        }
    };
    const handleLogOut = () => {
        Cookies.remove('userInfo');
        dispatch(actions.setUserInfo(null));
        dispatch(actions.setCurrentInvoice({}));
        dispatch(actions.setCart(null));
        if (currentPath !== config.routes.home) {
            navigate(config.routes.home);
        }
    };
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
                    Tiếng Việt
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
                    English
                </div>
            ),
        },
    ];
    const onChangeLanguage = (value) => {
        i18n.changeLanguage(value);
        Cookies.set('language', value);
    };
    return (
        <>
            <header className={cx('wrapper', { active: showMenuMb })}>
                <div className={cx('inner')}>
                    <div className={cx('side-group')}>
                        <div className={cx('logo-wrapper')}>
                            <Link to={config.routes.home}>
                                <img src={images.logo} className={cx('logo')} alt="logo" />
                            </Link>
                            <div onClick={handleCloseMenuMb} className={cx('close-btn-mb')}>
                                <MdOutlineClose />
                            </div>
                        </div>
                        <Search />
                    </div>
                    <div className={cx('side-group')}>
                        <Select
                            onChange={onChangeLanguage}
                            defaultValue={i18n.language}
                            options={LANGUAGES_MENU}
                            bordered={false}
                            style={{
                                minWidth: 125,
                            }}
                            className={cx('language-select', 'header-select')}
                        />
                        <Divider className={cx('divider', 'hide-mb')} type="vertical" />
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
                                        <div className={cx('delivery-title')}>{t('delivery')}</div>{' '}
                                        <div className={cx('delivery-subtitle')}>{state.detailAddress.address}</div>
                                    </>
                                ) : (
                                    <div className={cx('delivery-no-address')}>{t('header.chooseAddress')}</div>
                                )}
                            </div>
                        </div>
                        <div className={cx('actions', 'hide-mb')}>
                            {state.userInfo ? (
                                <>
                                    <Dropdown
                                        menu={{
                                            items: USER_MENU,
                                            onClick: handleOnchangeMenu,
                                        }}
                                    >
                                        <div className={cx('action-icon')}>
                                            <Avatar src={state.userInfo.photo} />
                                        </div>
                                    </Dropdown>
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
                        <>
                            <NavLink
                                className={(nav) => cx('header-nav_item', 'show-mb', { active: nav.isActive })}
                                to={config.routes.history}
                            >
                                Trang cá nhân
                            </NavLink>
                            <NavLink
                                className={(nav) => cx('header-nav_item', 'show-mb', { active: nav.isActive })}
                                to={config.routes.favor}
                            >
                                Trang yêu thích
                            </NavLink>
                            <div
                                onClick={() => {
                                    navigate(config.routes.home);
                                    handleLogOut();
                                }}
                                className={cx('header-nav_item', 'show-mb')}
                            >
                                Đăng xuất
                            </div>
                        </>
                    </div>
                </div>
            </header>
            <div ref={overlayRef} className={cx('menu-modal-overlay', { active: showMenuMb })}></div>
            <MdOutlineMenu onClick={handleShowMenuMb} className={cx('show-menu-mb')} />
        </>
    );
}

export default Header;
