import styles from './HistoryPage.module.scss';
import classNames from 'classnames/bind';
import { BsFillClipboard2Fill, BsFillPhoneFill } from 'react-icons/bs';
import Button from '../../components/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image';
import { Link } from 'react-router-dom';
import config from '../../config';
import LocalStorageManager from '../../utils/LocalStorageManager';
import dayjs from 'dayjs';
import { BillIcon } from '../../components/Icons';
import DetailInvoice from '../../components/DetailInvoice/DetailInvoice';
const cx = classNames.bind(styles);

function HistoryPage() {
    const [listInvoice, setListInvoice] = useState([]);
    const [detailInvoice, setDetailInvoice] = useState();
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const localStorageManager = LocalStorageManager.getInstance();
    const getListInvoice = async () => {
        const token = localStorageManager.getItem('token');
        setLoading(true);
        if (token) {
            const results = await invoiceService.getAllInvoice(token);
            if (results) {
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
            if (listInvoice[listInvoice.length - 1].status === 0 || listInvoice[listInvoice.length - 1].status === 1) {
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
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <BsFillClipboard2Fill className={cx('title-icon')} /> Lịch sử đặt hàng
                </div>
                {loading ? (
                    <div className={cx('loader')}>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
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
                                            Đơn hàng hiện tại -{' '}
                                            <span>
                                                Đặt lúc {dayjs(currentInvoice.date).format('HH:mm')} ngày{' '}
                                                {dayjs(currentInvoice.date).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                        <div className={cx('invoice-info')}>
                                            Trạng thái :{' '}
                                            <span>
                                                {currentInvoice.status === 0
                                                    ? 'Chưa thanh toán'
                                                    : currentInvoice.status === 1
                                                    ? 'Đang giao'
                                                    : 'Đã giao'}
                                            </span>
                                        </div>
                                        <div className={cx('invoice-info')}>
                                            Tổng tiền :{' '}
                                            <span>
                                                {priceFormat(currentInvoice.shippingFee + currentInvoice.total)}đ
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
                                                  Tổng tiền : <span>{priceFormat(item.shippingFee + item.total)}đ</span>
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
                                                  Tổng tiền : <span>{priceFormat(item.shippingFee + item.total)}đ</span>
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
                )}
            </div>
        </>
    );
}

export default HistoryPage;
