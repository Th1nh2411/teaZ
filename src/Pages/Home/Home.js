import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import Slider from '../../components/Slider/Slider';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useContext, useEffect, useState } from 'react';
import * as shopService from '../../services/shopService';
import { StoreContext, actions } from '../../store';
import { useTranslation } from 'react-i18next';
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
                <div className={cx('type-list')}>
                    {orderTypes.map((type, index) => (
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
                    ))}
                </div>
                <div className={cx('order-subtitle')}>{t('shopSlogan')}</div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row className={cx('order-list')}>
                        {menu &&
                            menu.map((item, index) => (
                                <Col
                                    key={index}
                                    md="3"
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
