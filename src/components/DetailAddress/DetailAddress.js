import styles from './DetailAddress.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import Image from '../Image/Image';
import * as mapService from '../../services/mapService';
import * as shopService from '../../services/shopService';

import LocalStorageManager from '../../utils/LocalStorageManager';
import { IoLocationSharp, IoSearch } from 'react-icons/io5';
import { BiStore, BiTargetLock } from 'react-icons/bi';
import { useDebounce } from '../../hooks';
import { AiFillCloseCircle, AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import images from '../../assets/images';
import { StoreContext, actions } from '../../store';

const cx = classNames.bind(styles);

function DetailAddress({ data = {}, onCloseModal = () => {}, onChangeLocation = () => {} }) {
    const [location, setLocation] = useState({ latitude: data.latitude, longitude: data.longitude });
    const [address, setAddress] = useState(data.address);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [shopInfo, setShopInfo] = useState();
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const [state, dispatch] = useContext(StoreContext);
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            onChangeLocation(latitude, longitude);
            const results = await mapService.getAddress(latitude, longitude);
            if (results) {
                setAddress(results.display_name);
            }
        });
    };
    const getShopInfo = async () => {
        const results = await shopService.getShopInfo(location.latitude, location.longitude);
        console.log(results);
        if (results) {
            setShopInfo(results);
            dispatch(actions.setDistance(results.distance));
        }
    };
    useEffect(() => {
        getShopInfo();
    }, [location]);
    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            const results = await mapService.searchAddress(debouncedValue);
            setSearchResult(results);

            setLoading(false);
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
        setLocation({ latitude, longitude });
        setAddress(newAddress);
        setSearchResult([]);
        setSearchValue('');
        onChangeLocation(latitude, longitude);
        dispatch(actions.setDetailAddress({ address: newAddress }));
    };
    const handleClickCurrentLocation = () => {
        getCurrentLocation();
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
                <div className={cx('header-title')}>Giao hàng</div>
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
                <input onChange={handleChangeInput} value={searchValue} placeholder="Vui lòng nhập địa chỉ" />
                {loading ||
                    (!!searchValue && (
                        <button onClick={handleClearSearch} className={cx('clear')}>
                            <AiFillCloseCircle />
                        </button>
                    ))}

                {loading && <AiOutlineLoading3Quarters className={cx('loading')} />}
            </div>
            {searchResult.length !== 0 ? (
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
                    <div className={cx('chosen-address')}>
                        <span>Địa chỉ đã chọn :</span> {address}
                    </div>
                    <div onClick={handleClickCurrentLocation} className={cx('current-address')}>
                        <BiTargetLock className={cx('icon')} />
                        Lấy vị trí hiện tại
                    </div>
                    <div className={cx('divider')}></div>
                    <div className={cx('shop-result')}>
                        <h2 className={cx('shop-title')}>
                            Thông tin cửa hàng
                            <BiStore className={cx('icon')} />
                        </h2>
                        {shopInfo && (
                            <div className={cx('shop-item', 'active')}>
                                <Image src={shopInfo.shop.image} className={cx('shop-img')} />
                                <div className={cx('shop-info')}>
                                    <div className={cx('shop-address')}>Địa chỉ : {shopInfo.shop.address}</div>
                                    <div className={cx('shop-desc')}>
                                        <span>Khoảng cách tới quán :</span>{' '}
                                        {shopInfo.distance / 100 > 1
                                            ? `${(shopInfo.distance / 1000).toFixed(2)} km`
                                            : 'dưới 100 m'}
                                    </div>
                                    <div className={cx('shop-desc')}>
                                        <span>Giờ hoạt động :</span> 07:00am - 21:00pm
                                    </div>
                                    <div
                                        className={cx('shop-desc', {
                                            open: shopInfo.shop.isActive,
                                            close: !shopInfo.shop.isActive,
                                        })}
                                    >
                                        <span>Trạng thái hoạt động :</span>{' '}
                                        {shopInfo.shop.isActive ? 'Đang mở cửa' : 'Đã đóng cửa'}
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
