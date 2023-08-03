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
const cx = classNames.bind(styles);

const orderTypes = [
    { img: images.drink, name: 'Thức uống' },
    { img: images.coffee, name: 'Cà phê' },
    { img: images.tea, name: 'Trà' },
    { img: images.bakery, name: 'Bakery' },
];

function Home() {
    const [orderType, setOrderType] = useState(1);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const getListItem = async () => {
        setLoading(true);
        const results = await shopService.getItemFromShop(state.idShop, orderType);
        if (results) {
            setMenu(results.menu);
        }
        setLoading(false);
    };
    useEffect(() => {
        getListItem();
    }, [orderType, state.idShop]);
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
                <div className={cx('order-subtitle')}>
                    Chúng tôi tin rằng từng sản phẩm trà và cà phê sẽ càng thêm hảo hạng khi được tạo ra từ sự phấn đấu
                    không ngừng cùng niềm đam mê. Và chính kết nối dựa trên niềm tin, sự trung thực và tin yêu sẽ góp
                    phần mang đến những nét đẹp trong văn hóa thưởng trà và cà phê ngày càng bay cao, vươn xa.
                </div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row className={cx('order-list')}>
                        {menu.map((item, index) => (
                            <Col
                                key={index}
                                md="3"
                                onClick={() => {
                                    dispatch(actions.setDetailItem({ show: true, data: item }));
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
