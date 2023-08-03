import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import images from '../../../assets/images';
import Image from '../../../components/Image/Image';

const cx = classNames.bind(styles);

function Header() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('company-info')}>
                    <div className={cx('text')}>© Công ty CP Phúc Long Heritage 2023</div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>Mã số DN:</span>0316 871719 do sở KHĐT TPHCM cấp lần đầu ngày
                        21/05/2021
                    </div>
                    <div className={cx('text')}>
                        {' '}
                        <span className={cx('highlight')}>Địa chỉ:</span>
                        Phòng 702, Tầng 7, Tòa nhà Central Plaza, số 17 Lê Duẩn, phường Bến Nghé, quận 1, Hồ Chí Minh.
                    </div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>Điện thoại:</span>
                        1900234518 (Ext.9100/ 9102)
                    </div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>Email:</span>
                        sales@phuclong.masangroup.com, info2@phuclong.masangroup.com
                    </div>
                </div>
                <div className={cx('company-tick')}>
                    <Image src={images.tick} className={cx('tick-img')} />
                </div>
            </div>
        </footer>
    );
}

export default Header;
