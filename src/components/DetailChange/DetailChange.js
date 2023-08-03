import styles from './DetailChange.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Input';
import Button from '../Button';
import images from '../../assets/images';
import Image from '../Image/Image';
import * as cartService from '../../services/cartService';
import LocalStorageManager from '../../utils/LocalStorageManager';

const cx = classNames.bind(styles);

function DetailChange({ data, onCloseModal = () => {} }) {
    const localStorageManager = LocalStorageManager.getInstance();
    const deleteUnavailableItem = async () => {
        const token = localStorageManager.getItem('token');
        const results = await cartService.delUnavailableItem(data.listIdProduct, token);
    };
    return (
        <Modal
            className={cx('wrapper')}
            handleClickOutside={() => {
                onCloseModal();
                deleteUnavailableItem();
            }}
        >
            <div className={cx('title')}>Thay đổi giỏ hàng</div>
            <div className={cx('subtitle')}>
                Một số sản phẩm hết hàng hoặc thay đổi giá, khuyến mãi khi đổi cửa hàng. Vui lòng kiểm tra lại.
            </div>
            <div className={cx('list-recipe-change')}>
                {data.mess.map((item, index) => (
                    <div key={index} className={cx('recipe-change')}>
                        <Image className={cx('recipe-img')} src={item.image} />
                        <div className={cx('recipe-name')}>{item.name}</div>
                    </div>
                ))}
            </div>
            <Button
                primary
                onClick={() => {
                    onCloseModal();
                    deleteUnavailableItem();
                }}
                className={cx('confirm-btn')}
            >
                Xác nhận
            </Button>
        </Modal>
    );
}

export default DetailChange;
