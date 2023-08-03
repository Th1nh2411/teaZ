import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { AiFillCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import HeadlessTippy from '@tippyjs/react/headless';
import { IoSearch } from 'react-icons/io5';
import PopperWrapper from '../../../components/Popper';
import { useDebounce } from '../../../hooks';
import * as shopService from '../../../services/shopService';
import { StoreContext, actions } from '../../../store';
import OrderItem from '../../../components/OrderItem/OrderItem';
import Image from '../../../components/Image/Image';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { priceFormat } from '../../../utils/format';

const cx = classNames.bind(styles);
function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const inputRef = useRef();
    const [showDetailRecipe, setShowDetailRecipe] = useState(false);
    const [detailRecipe, setDetailRecipe] = useState({});
    const [state, dispatch] = useContext(StoreContext);
    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            const results = await shopService.getSearchResult(debouncedValue, state.idShop);
            setSearchResult(results.recipes);

            setLoading(false);
        };
        fetchApi();
    }, [debouncedValue]);
    const handleClearSearch = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };
    const handleHideResult = () => {
        setShowResult(false);
    };
    const handleChangeInput = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleSubmit = (e) => {};
    return (
        // Using a wrapper div => solve warning Tippy, creating a newparentNode context
        <>
            <HeadlessTippy
                offset={[0, 5]}
                placement="bottom-start"
                interactive
                visible={showResult && searchResult && searchResult.length > 0}
                onClickOutside={handleHideResult}
                render={(attrs) => (
                    <>
                        <PopperWrapper>
                            <div className={cx('search-result')} tabIndex="-1">
                                {/* <h4 className={cx('search-title')}>Recipes</h4> */}
                                {searchResult.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => dispatch(actions.setDetailItem({ show: true, data: item }))}
                                    >
                                        <div className={cx('item-wrapper')}>
                                            <div className={cx('d-flex')}>
                                                <div className={cx('item-img-wrapper')}>
                                                    <Image src={item.image} className={cx('item-img')} />
                                                </div>
                                                <div className={cx('item-info')}>
                                                    <div className={cx('item-name')}>{item.name}</div>
                                                    <div className={cx('item-price-wrapper')}>
                                                        {item.discount !== 100 && (
                                                            <div className={cx('item-price')}>
                                                                {priceFormat(item.price)}₫
                                                            </div>
                                                        )}
                                                        <div className={cx('item-price-discounted')}>
                                                            {priceFormat((item.price * item.discount) / 100)}₫
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('item-add-btn')}>
                                                <MdOutlineAddShoppingCart className={cx('add-icon')} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopperWrapper>
                    </>
                )}
            >
                <div className={cx('search')}>
                    <div className={cx('search-icon')}>
                        <IoSearch />
                    </div>
                    <input
                        ref={inputRef}
                        onChange={handleChangeInput}
                        value={searchValue}
                        placeholder="Bạn muốn đặt gì..."
                        onFocus={() => setShowResult(true)}
                    />
                    {loading ||
                        (!!searchValue && (
                            <button onClick={handleClearSearch} className={cx('clear')}>
                                <AiFillCloseCircle />
                            </button>
                        ))}

                    {loading && <AiOutlineLoading3Quarters className={cx('loading')} />}
                </div>
            </HeadlessTippy>
        </>
    );
}

export default Search;
