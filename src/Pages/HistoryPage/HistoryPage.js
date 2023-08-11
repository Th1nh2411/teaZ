import styles from './HistoryPage.module.scss';
import classNames from 'classnames/bind';
import { BsFillClipboard2Fill, BsFillPhoneFill, BsPersonCircle } from 'react-icons/bs';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image';
import LocalStorageManager from '../../utils/LocalStorageManager';
import dayjs from 'dayjs';
import { BillIcon } from '../../components/Icons';
import DetailInvoice from '../../components/DetailInvoice/DetailInvoice';
import ProfileForm from './ProfileForm';
import { MdEdit, MdLock } from 'react-icons/md';
import ChangePwForm from './ChangePwForm';
const cx = classNames.bind(styles);

function HistoryPage() {
    const [listInvoice, setListInvoice] = useState([]);
    const [detailInvoice, setDetailInvoice] = useState();
    const [showEditProfile, setShowEditProfile] = useState();
    const [showChangePw, setShowChangePw] = useState();
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManager = LocalStorageManager.getInstance();
    const getListInvoice = async () => {
        const token = localStorageManager.getItem('token');
        setLoading(true);
        if (token) {
            const results = await invoiceService.getAllInvoice(token);
            if (results && results.isSuccess) {
                setListInvoice(results.invoices);
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        getListInvoice();
    }, [state.currentInvoice.invoice]);
    const currentInvoice = useMemo(() => {
        if (listInvoice.length !== 0) {
            if (listInvoice[listInvoice.length - 1].status < 3) {
                return listInvoice[listInvoice.length - 1];
            }
        } else {
            return null;
        }
    }, [listInvoice]);
    const handleShowDetailInvoice = (id) => {
        setDetailInvoice(id);
    };
    return (
        <>
            {detailInvoice && <DetailInvoice idInvoice={detailInvoice} onCloseModal={() => setDetailInvoice(false)} />}
            {showEditProfile && <ProfileForm data={state.userInfo} onCloseModal={() => setShowEditProfile(false)} />}
            {showChangePw && <ChangePwForm onCloseModal={() => setShowChangePw(false)} />}
            <div className={cx('wrapper')}>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <Row>
                        <Col lg={5}>
                            <div className={cx('title')}>
                                <BsPersonCircle className={cx('title-icon')} /> Thông tin cá nhân
                            </div>
                            <div className={cx('body')}>
                                <Image
                                    src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png"
                                    className={cx('avatar')}
                                />
                                <div className={cx('profile-wrapper')}>
                                    <div className={cx('d-flex')}>
                                        <Button onClick={() => setShowEditProfile(true)} leftIcon={<MdEdit />}>
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            className={cx('ml-8')}
                                            onClick={() => setShowChangePw(true)}
                                            leftIcon={<MdLock />}
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                    </div>
                                    <h3 className={cx('profile-info')}>
                                        Tên người dùng: <span>{state.userInfo && state.userInfo.name}</span>
                                    </h3>
                                    <h3 className={cx('profile-info')}>
                                        Số điện thoại: <span>{state.userInfo && state.userInfo.phone}</span>
                                    </h3>
                                    <h3 className={cx('profile-info')}>
                                        Tài khoản gmail: <span>{state.userInfo && state.userInfo.mail}</span>
                                    </h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={7}>
                            <div className={cx('title')}>
                                <BsFillClipboard2Fill className={cx('title-icon')} /> Lịch sử đặt hàng
                            </div>
                            <div className={cx('body')}>
                                {currentInvoice && (
                                    <div className={cx('invoice-wrapper')}>
                                        <div className={cx('left-side')}>
                                            <Image
                                                src={
                                                    'https://order.phuclong.com.vn/_next/static/images/delivery-686d7142750173aa8bc5f1d11ea195e4.png'
                                                }
                                                className={cx('invoice-img')}
                                            />
                                            <div className={cx('invoice-body')}>
                                                <div className={cx('invoice-title')}>
                                                    Đơn hàng hiện tại
                                                    {/* -{' '}
                                                    <span>
                                                        Đặt lúc {dayjs(currentInvoice.date).format('HH:mm')} ngày{' '}
                                                        {dayjs(currentInvoice.date).format('DD/MM/YYYY')}
                                                    </span> */}
                                                </div>
                                                <div className={cx('invoice-info')}>
                                                    Trạng thái :{' '}
                                                    <span>
                                                        {currentInvoice.status === 0
                                                            ? 'Chưa thanh toán'
                                                            : currentInvoice.status === 1
                                                            ? 'Đã thanh toán'
                                                            : currentInvoice.status === 2
                                                            ? 'Đang giao'
                                                            : 'Đã giao'}
                                                    </span>
                                                </div>
                                                <div className={cx('invoice-info')}>
                                                    Tổng tiền :{' '}
                                                    <span>
                                                        {priceFormat(currentInvoice.shippingFee + currentInvoice.total)}
                                                        đ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => handleShowDetailInvoice(currentInvoice.idInvoice)}
                                            className={cx('invoice-actions')}
                                        >
                                            Xem chi tiết
                                        </div>
                                    </div>
                                )}

                                {currentInvoice
                                    ? listInvoice.slice(0, -1).map((item, index) => (
                                          <div key={index} className={cx('invoice-wrapper')}>
                                              <div className={cx('left-side')}>
                                                  <BillIcon className={cx('invoice-img')} />
                                                  <div className={cx('invoice-body')}>
                                                      <div className={cx('invoice-title')}>
                                                          Đơn hàng {dayjs(item.date).format('HH:mm')}{' '}
                                                          {dayjs(item.date).format('DD/MM/YYYY')}
                                                      </div>
                                                      <div className={cx('invoice-info')}>
                                                          Trạng thái :{' '}
                                                          <span>
                                                              {item.status === 0
                                                                  ? 'Chưa thanh toán'
                                                                  : item.status === 1
                                                                  ? 'Đang giao'
                                                                  : 'Đã giao'}
                                                          </span>
                                                      </div>
                                                      <div className={cx('invoice-info')}>
                                                          Tổng tiền :{' '}
                                                          <span>{priceFormat(item.shippingFee + item.total)}đ</span>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div
                                                  onClick={() => handleShowDetailInvoice(item.idInvoice)}
                                                  className={cx('invoice-actions')}
                                              >
                                                  Xem chi tiết
                                              </div>
                                          </div>
                                      ))
                                    : listInvoice.map((item, index) => (
                                          <div key={index} className={cx('invoice-wrapper')}>
                                              <div className={cx('left-side')}>
                                                  <BillIcon className={cx('invoice-img')} />
                                                  <div className={cx('invoice-body')}>
                                                      <div className={cx('invoice-title')}>
                                                          Đơn hàng đặt lúc {dayjs(item.date).format('HH:mm')} ngày{' '}
                                                          {dayjs(item.date).format('DD/MM/YYYY')}
                                                      </div>
                                                      <div className={cx('invoice-info')}>
                                                          Trạng thái :{' '}
                                                          <span>
                                                              {item.status === 0
                                                                  ? 'Chưa thanh toán'
                                                                  : item.status === 1
                                                                  ? 'Đang giao'
                                                                  : 'Đã giao'}
                                                          </span>
                                                      </div>
                                                      <div className={cx('invoice-info')}>
                                                          Tổng tiền :{' '}
                                                          <span>{priceFormat(item.shippingFee + item.total)}đ</span>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div
                                                  onClick={() => handleShowDetailInvoice(item.idInvoice)}
                                                  className={cx('invoice-actions')}
                                              >
                                                  Xem chi tiết
                                              </div>
                                          </div>
                                      ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
}

export default HistoryPage;
