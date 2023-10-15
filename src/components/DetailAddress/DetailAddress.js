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

const cx = classNames.bind(styles);

function DetailAddress({ data = {}, onCloseModal = () => {}, onChangeLocation = () => {} }) {
    const [location, setLocation] = useState({ latitude: data.latitude, longitude: data.longitude });

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [shopInfo, setShopInfo] = useState({});
    const [searchLoading, setSearchLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const [state, dispatch] = useContext(StoreContext);
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            onChangeLocation(latitude, longitude);
        });
    };
    const getShopInfo = async () => {
        setDataLoading(true);
        const results = await shopService.getShopInfo(location.latitude, location.longitude);
        setDataLoading(false);
        if (results) {
            setShopInfo(results.data);
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
        setLocation({ latitude, longitude });
        setSearchResult([]);
        setSearchValue('');
        onChangeLocation(latitude, longitude);
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
                    <div className={cx('chosen-address')}>
                        <span>Địa chỉ đã chọn :</span> {state.detailAddress.address}
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
                        <Skeleton loading={dataLoading}>
                            <div className={cx('shop-item', 'active')}>
                                <Image src={shopInfo.image} className={cx('shop-img')} />
                                <div className={cx('shop-info')}>
                                    <div className={cx('shop-address')}>Địa chỉ : {shopInfo.address}</div>
                                    <div className={cx('shop-desc')}>
                                        <span>Khoảng cách tới quán :</span> {data.distance} km
                                    </div>
                                    <div className={cx('shop-desc')}>
                                        <span>Giờ hoạt động :</span> 07:00am - 21:00pm
                                    </div>
                                    <div
                                        className={cx('shop-desc', {
                                            open: shopInfo.isActive,
                                            close: !shopInfo.isActive,
                                        })}
                                    >
                                        <span>Trạng thái hoạt động :</span>{' '}
                                        {shopInfo.isActive ? 'Đang mở cửa' : 'Đã đóng cửa'}
                                    </div>
                                </div>
                            </div>
                        </Skeleton>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default DetailAddress;
