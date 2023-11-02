import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import Slider from '../../components/Slider/Slider';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useContext, useEffect, useState } from 'react';
import * as shopService from '../../services/shopService';
import { StoreContext, actions } from '../../store';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
const cx = classNames.bind(styles);

function Home() {
    const [orderType, setOrderType] = useState(1);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();
    const getListItem = async () => {
        setLoading(true);
        const results = await shopService.getItemByType(orderType, state.userInfo && state.userInfo.userId);
        if (results) {
            setMenu(results.data && results.data.filter((item) => item.isActive !== 0));
        }
        setLoading(false);
    };
    useEffect(() => {
        getListItem();
    }, [orderType, state.userInfo]);
    const orderTypes = [
        { img: images.drink, name: t('home.drink') },
        { img: images.coffee, name: t('home.coffee') },
        { img: images.tea, name: t('home.tea') },
        { img: images.bakery, name: t('home.bakery') },
    ];
    return (
        <div className={cx('wrapper')}>
            <Slider />
            <section className={cx('order-section')}>
                <div style={{ width: '60vw', margin: 'auto' }}>
                    <Row gutter={[15]} style={{ marginBottom: 20 }}>
                        {orderTypes.map((type, index) => (
                            <Col xs={12} md={6}>
                                <div
                                    key={index + 1}
                                    onClick={() => setOrderType(index + 1)}
                                    className={cx('type-item', { active: orderType === index + 1 })}
                                >
                                    <div className={cx('type-img-wrapper')}>
                                        <Image src={type.img} className={cx('type-img')} />
                                    </div>
                                    <div className={cx('type-name')}>{type.name}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className={cx('order-subtitle')}>{t('shopSlogan')}</div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row gutter={[15]} className={cx('order-list')}>
                        {menu &&
                            menu.map((item, index) => (
                                <Col
                                    key={index}
                                    xs={24}
                                    md={8}
                                    lg={6}
                                    onClick={() => {
                                        if (item.isActive === 1) {
                                            dispatch(actions.setDetailItem({ show: true, data: item }));
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

export default Home;
