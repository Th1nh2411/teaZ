import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image/Image';
import { Col } from 'react-bootstrap';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { priceFormat } from '../../utils/format';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const cx = classNames.bind(styles);

function OrderItem({ data = {} }) {
    return (
        <div className={cx('order-item', { disable: !data.isActive })}>
            <h3 className={cx('disable-title')}>Ngưng bán</h3>
            <div>
                <div className={cx('order-img-wrapper')}>
                    <Image src={data.image} className={cx('order-img')} />
                    {!!data.isLiked && <AiFillHeart className={cx('heart-icon')} />}
                    {data.discount !== 100 && (
                        <div className={cx('sale-off')}>
                            <span className={cx('sale-off-percent')}>{100 - data.discount}% OFF</span>
                        </div>
                    )}
                </div>
                <div className={cx('order-name')}>{data.name}</div>
            </div>
            <div className={cx('order-footer')}>
                <div className={cx('order-price')}>{priceFormat((data.price * data.discount) / 100)}₫</div>
                <div className={cx('order-add-btn')}>
                    Đặt món
                    <MdOutlineAddShoppingCart className={cx('add-icon')} />
                </div>
            </div>
        </div>
    );
}

export default OrderItem;
