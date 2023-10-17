import PropTypes from 'prop-types';
import styles from './CropperImage.module.scss';
import classNames from 'classnames/bind';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillExclamationCircle, AiFillInfoCircle } from 'react-icons/ai';
import { useContext, useEffect, useRef, useState } from 'react';
import * as authService from '../../services/authService';
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Slider, Space, Upload, message } from 'antd';
import { BsUpload } from 'react-icons/bs';
import { StoreContext, actions } from '../../store';
import AvatarEditor from 'react-avatar-editor';
const cx = classNames.bind(styles);

const CropperImage = ({ src, modalOpen, onModalClose = () => {} }) => {
    const [state, dispatch] = useContext(StoreContext);
    const [slideValue, setSlideValue] = useState(10);
    const [loading, setLoading] = useState(false);
    const cropRef = useRef(null);

    const editProfile = async (values) => {
        const results = await authService.editProfile(values);
        if (results) {
            state.showToast('Thành công', results.message);
        }
    };
    const handleSave = async () => {
        if (cropRef) {
            const dataUrl = cropRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            const file = new File([blob], 'avatar.png', { type: 'image/png' });
            setLoading(true);
            const uploadResult = await authService.uploadFile(file);
            if (uploadResult) {
                await editProfile({ photo: uploadResult.url });
                dispatch(actions.setUserInfo({ ...state.userInfo, photo: uploadResult.url }));
            }
            setLoading(false);
            onModalClose();
        }
    };

    return (
        <Modal onCancel={onModalClose} open={modalOpen} footer={false}>
            <div style={{ width: '100%', padding: '0 20px' }} align="center">
                <h1 style={{ marginBottom: 15 }}>Cập nhật ảnh đại diện</h1>
                <AvatarEditor
                    ref={cropRef}
                    image={src}
                    style={{ width: '100%', height: '100%' }}
                    border={50}
                    borderRadius={150}
                    color={[0, 0, 0, 0.72]}
                    scale={slideValue / 10}
                    rotate={0}
                />

                {/* MUI Slider */}
                <Slider
                    min={10}
                    max={50}
                    defaultValue={slideValue}
                    value={slideValue}
                    onChange={(value) => setSlideValue(value)}
                />
                <Space>
                    <Button size="middle" onClick={onModalClose}>
                        Huỷ bỏ
                    </Button>
                    <Button loading={loading} type="primary" size="middle" onClick={handleSave}>
                        Cập nhật
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default CropperImage;
