import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import images from '../../../assets/images';
import Image from '../../../components/Image/Image';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

function Footer() {
    const { t } = useTranslation();
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('company-info')}>
                    <div className={cx('text')}>© {t('footer.company')}</div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>{t('footer.DNTitle')}:</span>
                        {t('footer.DN')}
                    </div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>{t('addressTitle')}:</span>
                        {t('footer.address')}
                    </div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>{t('phoneTitle')}:</span>
                        1900234518 (Ext.9100/ 9102)
                    </div>
                    <div className={cx('text')}>
                        <span className={cx('highlight')}>Email:</span>
                        sales@Panda.masangroup.com, info2@Panda.masangroup.com
                    </div>
                </div>
                <div className={cx('company-tick')}>
                    <Image src={images.tick} className={cx('tick-img')} />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
