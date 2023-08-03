import styles from './Slider.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';
import images from '../../assets/images';
import Modal from '../Modal/Modal';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from '../Image/Image';

const cx = classNames.bind(styles);
const sliders = [images.coconutCaramel, images.longan, images.twoFor1, images.stayTuned];

function Slider({ data = {}, onCloseModal }) {
    const [sliderCheck, setSliderCheck] = useState(0);

    const handleClickChangeSlide = (value) => {
        setSliderCheck(value);
    };
    useEffect(() => {
        var counter = 0;
        const slideInterval = setInterval(() => {
            setSliderCheck(sliderCheck + 1);
            if (sliderCheck === sliders.length - 1) {
                counter = 0;
                setSliderCheck(0);
            }
        }, 3000);
        return () => clearInterval(slideInterval);
    }, [sliderCheck]);
    return (
        <section className={cx('slider-section')}>
            <div className={cx('slide-list')}>
                {sliders.map((slider, index) => (
                    <Image
                        key={index}
                        className={cx('slide')}
                        src={slider}
                        style={index === 0 ? { marginLeft: sliderCheck * -100 + '%' } : {}}
                    />
                ))}
            </div>
            <div className={cx('slide-dots')}>
                {sliders.map((slider, index) => (
                    <input
                        key={index}
                        onChange={() => handleClickChangeSlide(index)}
                        value={index}
                        checked={sliderCheck == index}
                        type="radio"
                        name="slide-dot"
                    />
                ))}
            </div>
            <div
                onClick={() => {
                    if (sliderCheck === 0) {
                        setSliderCheck(0);
                    } else {
                        setSliderCheck((prev) => prev - 1);
                    }
                }}
                className={cx('left-slide-btn')}
            >
                <FiChevronLeft />
            </div>
            <div
                onClick={() => {
                    if (sliderCheck === sliders.length) {
                        setSliderCheck(0);
                    } else {
                        setSliderCheck((prev) => prev + 1);
                    }
                }}
                className={cx('right-slide-btn')}
            >
                <FiChevronRight />
            </div>
        </section>
    );
}

export default Slider;
