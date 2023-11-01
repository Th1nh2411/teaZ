import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Image from '../Image/Image';
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai';
import { priceFormat } from '../../utils/format';
import { StoreContext, actions } from '../../store';
import * as cartService from '../../services/cartService';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function CartItem({ data = {}, onDelItem = () => {} }) {
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const handleEditItem = () => {
        dispatch(actions.setDetailItem({ show: true, data, editing: true }));
    };
    const handleDelItem = async () => {
        const results = await cartService.delCartItem(data.productId);
        if (results) {
            onDelItem();
        }
    };
    return (
        <div className={cx('item-wrapper', { disable: data.isActive === 2 })}>
            <h3 className={cx('disable-title')}>{t('stopSelling')}</h3>
            <div className={cx('item-left-side')}>
                <div className={cx('item-img-wrapper')}>
                    <Image src={data.image} className={cx('item-img')} />
                </div>
                <div className={cx('item-info')}>
                    <div className={cx('item-name')}>
                        {data.name} ({data.size ? 'L' : 'M'}) x{data.quantity}
                    </div>
                    <div className={cx('item-topping')}>
                        {data.toppings.length !== 0 && <span>Topping :</span>}{' '}
                        {data.toppings.map((topping) => topping.name).join(', ')}
                    </div>
                    <div className={cx('item-price')}>{priceFormat(data.price)}đ</div>
                    {/* <div className={cx('item-price')}></div> */}
                </div>
            </div>
            <div className={cx('item-actions')}>
                <div onClick={handleEditItem} className={cx('action-edit')}>
                    <AiTwotoneEdit />
                </div>
                <Popconfirm
                    title={t('delete')}
                    description={t('delCartItem')}
                    onConfirm={handleDelItem}
                    okText={t('delete')}
                    cancelText={t('cancel')}
                >
                    <div className={cx('action-del')}>
                        <AiTwotoneDelete />
                    </div>
                </Popconfirm>
            </div>
        </div>
    );
}

export default CartItem;
