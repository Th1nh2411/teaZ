import styles from './HistoryPage.module.scss';
import classNames from 'classnames/bind';
import { BsCameraFill, BsFillClipboard2Fill, BsFillPhoneFill, BsPersonCircle } from 'react-icons/bs';
import Button from '../../components/Button';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as invoiceService from '../../services/invoiceService';
import { StoreContext, actions } from '../../store';
import { priceFormat } from '../../utils/format';
import { IoLocationSharp } from 'react-icons/io5';
import { AiOutlineRight } from 'react-icons/ai';
import Image from '../../components/Image';
import dayjs from 'dayjs';
import { BillIcon } from '../../components/Icons';
import DetailInvoice from '../../components/DetailInvoice/DetailInvoice';
import ProfileForm from './ProfileForm';
import { MdEdit, MdLock } from 'react-icons/md';
import ChangePwForm from './ChangePwForm';
import { Alert, Badge, Col, Row } from 'antd';
import CropperImage from '../../components/CropperImage/CropperImage';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(styles);

function HistoryPage() {
    const [listInvoice, setListInvoice] = useState([]);
    const [detailInvoice, setDetailInvoice] = useState();
    const [showEditProfile, setShowEditProfile] = useState();
    const [showChangePw, setShowChangePw] = useState();
    const [loading, setLoading] = useState();
    const [state, dispatch] = useContext(StoreContext);
    const { t } = useTranslation();

    const uploadRef = useRef(null);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [showModalAvatar, setShowModalAvatar] = useState(false);
    const getListInvoice = async () => {
        setLoading(true);
        const results = await invoiceService.getAllInvoice();
        if (results) {
            setListInvoice(results.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        getListInvoice();
    }, [state.currentInvoice]);
    const handleShowDetailInvoice = (id) => {
        setDetailInvoice(id);
    };
    const handleImgChange = (e) => {
        setAvatarSrc(URL.createObjectURL(e.target.files[0]));
        e.target.value = '';
        setShowModalAvatar(true);
    };
    const handleInputClick = (e) => {
        e.preventDefault();
        uploadRef.current.click();
    };
    return (
        <>
            <CropperImage modalOpen={showModalAvatar} src={avatarSrc} onModalClose={() => setShowModalAvatar(false)} />
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
                    <Row gutter={[40, 40]}>
                        <Col xs={24} lg={12}>
                            <div className={cx('card')} style={{ backgroundColor: 'rgb(74 96 113)' }}>
                                <div className={cx('title')} style={{ color: '#26bada' }}>
                                    <BsPersonCircle className={cx('title-icon')} />
                                    {t('history.userInfo')}
                                </div>
                                <div className={cx('body')}>
                                    <div className={cx('avatar-wrapper')}>
                                        <BsCameraFill onClick={handleInputClick} className={cx('camera-icon')} />
                                        <Image src={state.userInfo && state.userInfo.photo} className={cx('avatar')} />
                                        <input
                                            hidden
                                            type="file"
                                            accept="image/*"
                                            ref={uploadRef}
                                            onChange={handleImgChange}
                                        />
                                    </div>
                                    <div className={cx('profile-wrapper')}>
                                        <div className={cx('d-flex')} style={{ margin: '10px 0' }}>
                                            <Button onClick={() => setShowEditProfile(true)} leftIcon={<MdEdit />}>
                                                {t('updateTitle')}
                                            </Button>
                                            <Button
                                                className={cx('ml-8')}
                                                onClick={() => setShowChangePw(true)}
                                                leftIcon={<MdLock />}
                                            >
                                                {t('changePWTitle')}
                                            </Button>
                                        </div>
                                        <h4 className={cx('profile-info')}>
                                            {t('userNameTitle')}: <span>{state.userInfo && state.userInfo.name}</span>
                                        </h4>
                                        <h4 className={cx('profile-info')}>
                                            {t('phoneTitle')}: <span>{state.userInfo && state.userInfo.phone}</span>
                                        </h4>
                                        <h4 className={cx('profile-info')}>
                                            {t('addressTitle')}: <span>{state.userInfo && state.userInfo.address}</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={12}>
                            <div className={cx('card')}>
                                <div className={cx('title')}>
                                    <BsFillClipboard2Fill className={cx('title-icon')} />
                                    {t('history.orderHistory')}
                                </div>
                                <div className={cx('body', 'invoice-list')}>
                                    {listInvoice && listInvoice.length !== 0 ? (
                                        listInvoice.map((item, index) => (
                                            <div key={index} className={cx('invoice-wrapper')}>
                                                <div className={cx('left-side')}>
                                                    {item.status === 2 ? (
                                                        <Image
                                                            src={
                                                                'https://order.phuclong.com.vn/_next/static/images/delivery-686d7142750173aa8bc5f1d11ea195e4.png'
                                                            }
                                                            className={cx('invoice-img')}
                                                        />
                                                    ) : (
                                                        <BillIcon className={cx('invoice-img')} />
                                                    )}
                                                    <div className={cx('invoice-body')}>
                                                        <div className={cx('invoice-title')}>
                                                            {t('order')}{' '}
                                                            {dayjs(item.date)
                                                                .subtract(7, 'hours')
                                                                .format('HH:mm DD/MM/YYYY')}
                                                        </div>
                                                        <div className={cx('invoice-info')}>
                                                            {t('statusTitle')} :{' '}
                                                            <Badge
                                                                status={
                                                                    item.status === 0
                                                                        ? 'error'
                                                                        : item.status === 1
                                                                        ? 'warning'
                                                                        : item.status === 2
                                                                        ? 'processing'
                                                                        : item.status === 3
                                                                        ? 'success'
                                                                        : 'default'
                                                                }
                                                                text={
                                                                    !item.isPaid && item.paymentMethod === 'Vnpay'
                                                                        ? t('unpaid')
                                                                        : item.status === 0
                                                                        ? t('status0')
                                                                        : item.status === 1
                                                                        ? t('status1')
                                                                        : item.status === 2
                                                                        ? t('status2')
                                                                        : item.status === 3
                                                                        ? t('status3')
                                                                        : t('status4')
                                                                }
                                                            />
                                                        </div>
                                                        <div className={cx('invoice-info')}>
                                                            {t('totalTitle')} :{' '}
                                                            <span>{priceFormat(item.shippingFee + item.total)}đ</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => handleShowDetailInvoice(item.id)}
                                                    className={cx('invoice-actions')}
                                                >
                                                    {t('detail')}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Alert message={t('emptyOrder')} showIcon type="info" />
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
}

export default HistoryPage;
