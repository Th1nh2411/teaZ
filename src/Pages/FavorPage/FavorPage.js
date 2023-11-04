import styles from './FavorPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import Slider from '../../components/Slider/Slider';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useContext, useEffect, useState } from 'react';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { BiBookHeart } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
const cx = classNames.bind(styles);

function FavorPage() {
    const [favorItems, setFavorItems] = useState([]);
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const getListItem = async () => {
        setLoading(true);
        const results = await authService.getWishListItem();
        if (results) {
            setFavorItems(results.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        getListItem();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <section>
                <h1 className={cx('title')}>
                    <BiBookHeart style={{ marginRight: 6 }} />
                    {t('wishlist')}
                </h1>
                <div className={cx('subtitle')}>{t('shopSlogan')}</div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row gutter={[15]} className={cx('wish-list')}>
                        {favorItems.map((item, index) => (
                            <Col
                                key={index}
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                onClick={() => {
                                    if (item.isActive === 1) {
                                        dispatch(actions.setDetailItem({ show: true, id: item.id }));
                                    }
                                }}
                            >
                                <OrderItem data={item} key={index} />
                            </Col>
                        ))}
                    </Row>
                )}
            </section>
        </div>
    );
}

export default FavorPage;
