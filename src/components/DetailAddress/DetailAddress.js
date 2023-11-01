import styles from './DetailAddress.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import Image from '../Image/Image';
import * as mapService from '../../services/mapService';
import * as shopService from '../../services/shopService';

import { IoLocationSharp, IoSearch } from 'react-icons/io5';
import { BiStore, BiTargetLock } from 'react-icons/bi';
import { useDebounce } from '../../hooks';
import { AiFillCloseCircle, AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import images from '../../assets/images';
import { StoreContext, actions } from '../../store';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function DetailAddress({ data = {}, onCloseModal = () => {}, onChangeLocation = () => {} }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getSuccessLocation, getFailLocation);
        } else {
            console.log('Geolocation not supported');
        }
    };
    const getSuccessLocation = async (position) => {
        console.log(position.coords);
        const { latitude, longitude } = position.coords;
        onChangeLocation(latitude, longitude);
    };
    const getFailLocation = async (position) => {
        state.showToast('Bạn cần cấp quyền cho trang web lấy vị trí hiện tại!', '', 'error');
    };
    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setSearchLoading(true);
            const results = await mapService.searchAddress(debouncedValue);
            setSearchResult(results);

            setSearchLoading(false);
        };
        fetchApi();
    }, [debouncedValue]);
    const handleClearSearch = () => {
        setSearchValue('');
        setSearchResult([]);
    };
    const handleChangeInput = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };
    const handleClickAddress = (latitude, longitude, newAddress) => {
        setSearchResult([]);
        setSearchValue('');
        onChangeLocation(latitude, longitude);
    };

    return (
        <Modal
            className={cx('detail-wrapper')}
            handleClickOutside={() => {
                onCloseModal();
            }}
        >
            <div className={cx('header')}>
                <Image
                    src="https://order.phuclong.com.vn/_next/static/images/delivery-686d7142750173aa8bc5f1d11ea195e4.png"
                    className={cx('header-logo')}
                />
                <div className={cx('header-title')}>{t('delivery')}</div>
                <AiOutlineClose
                    onClick={() => {
                        onCloseModal();
                    }}
                    className={cx('close-icon')}
                />
            </div>
            <div className={cx('search')}>
                <div className={cx('search-icon')}>
                    <IoSearch />
                </div>
                <input onChange={handleChangeInput} value={searchValue} placeholder={t('header.addressInput')} />
                {searchLoading ||
                    (!!searchValue && (
                        <button onClick={handleClearSearch} className={cx('clear')}>
                            <AiFillCloseCircle />
                        </button>
                    ))}

                {searchLoading && <AiOutlineLoading3Quarters className={cx('loading')} />}
            </div>
            {searchResult && searchResult.length !== 0 ? (
                <div className={cx('search-result')}>
                    {searchResult.map((item, index) => (
                        <div
                            onClick={() => handleClickAddress(item.lat, item.lon, item.display_name)}
                            key={index}
                            className={cx('search-item')}
                        >
                            <IoLocationSharp className={cx('location-icon')} />
                            <div>
                                <div className={cx('address-title')}>
                                    {item.address.house_number} {item.address.road}
                                </div>
                                <div className={cx('address-detail')}>{item.display_name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {state.detailAddress.address && (
                        <div className={cx('chosen-address')}>
                            <span>{t('header.selectedAddress')} :</span> {state.detailAddress.address}
                        </div>
                    )}
                    <div onClick={getCurrentLocation} className={cx('current-address')}>
                        <BiTargetLock className={cx('icon')} />
                        {t('header.getCurrentLocation')}
                    </div>
                    <div className={cx('divider')}></div>
                    <div className={cx('shop-result')}>
                        <h2 className={cx('shop-title')}>
                            {t('header.shopInfo')}
                            <BiStore className={cx('icon')} />
                        </h2>
                        {state.shopInfo && (
                            <div className={cx('shop-item', 'active')}>
                                <Image src={state.shopInfo.image} className={cx('shop-img')} />
                                <div className={cx('shop-info')}>
                                    <div className={cx('shop-address')}>
                                        {t('addressTitle')} : {state.shopInfo.address}
                                    </div>
                                    <div className={cx('shop-desc')}>
                                        <span>{t('header.distanceToShop')} :</span> {data.distance} km
                                    </div>
                                    <div className={cx('shop-desc')}>
                                        <span>{t('header.operationTime')} :</span> 07:00am - 21:00pm
                                    </div>
                                    <div
                                        className={cx('shop-desc', {
                                            open: state.shopInfo.isActive,
                                            close: !state.shopInfo.isActive,
                                        })}
                                    >
                                        <span>{t('header.shopStatusTitle')} :</span>{' '}
                                        {state.shopInfo.isActive
                                            ? t('header.shopActiveStatus')
                                            : t('header.shopInactiveStatus')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Modal>
    );
}

export default DetailAddress;
