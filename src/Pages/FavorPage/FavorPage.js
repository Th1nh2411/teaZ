import styles from './FavorPage.module.scss';
import classNames from 'classnames/bind';
import Image from '../../components/Image';
import images from '../../assets/images';
import { Col, Row } from 'react-bootstrap';
import Slider from '../../components/Slider/Slider';
import OrderItem from '../../components/OrderItem/OrderItem';
import { useContext, useEffect, useState } from 'react';
import * as authService from '../../services/authService';
import { StoreContext, actions } from '../../store';
import { BiBookHeart } from 'react-icons/bi';
const cx = classNames.bind(styles);

function FavorPage() {
    const [favorItems, setFavorItems] = useState([]);
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
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
                    Danh sách món yêu thích
                </h1>
                <div className={cx('subtitle')}>
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
                    <Row className={cx('wish-list')}>
                        {favorItems.map((item, index) => (
                            <Col
                                key={index}
                                md="3"
                                onClick={() => {
                                    if (item.isActive) {
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

export default FavorPage;
