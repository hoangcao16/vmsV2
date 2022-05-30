import React, { useState, useEffect } from 'react';
import {
  AimOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  EditOutlined,
  CameraOutlined,
  BankOutlined,
  TrademarkOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Tooltip, Spin, Button } from 'antd';
import { TYPE_FORM_ACTION_ON_MAP } from '@/constants/map';
import camImgSrcDefault from '@/assets/img/cam-default.png';
import adUnitImgSrcDefault from '@/assets/img/adminis-unit-default.png';
import ExportEventFileApi from '@/services/exportEventFile';
import { isEmpty } from 'lodash';
import { Container } from './style';

const CamInfoPopup = (props) => {
  const {
    type,
    dataDetailInfo,
    startSnapshotCamera,
    onClosePopup,
    handleEditInfo,
    trans: intl,
  } = props;
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImageFileHanleler = (avatarFileName) => {
      if (avatarFileName) {
        ExportEventFileApi.getAvatar(avatarFileName).then((result) => {
          if (result) {
            let blob = new Blob([result], { type: 'octet/stream' });
            let url = window.URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            setImageUrl('');
          }
        });
      }
    };
    loadImageFileHanleler(dataDetailInfo?.avatarFileName);
  }, [dataDetailInfo?.avatarFileName]);

  const renderCamInfo = () => (
    <>
      <li>
        <EnvironmentOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__detail-address">
          {dataDetailInfo ? dataDetailInfo.address : ''}
        </span>
      </li>

      <li>
        <BankOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__detail-address camera-info__detail--adminis">
          {dataDetailInfo?.administrativeUnitName ? dataDetailInfo.administrativeUnitName : ''}
        </span>
      </li>

      <li>
        <TrademarkOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__detail-address camera-info__detail--venderName">
          {dataDetailInfo?.vendorName ? dataDetailInfo.vendorName : ''}
        </span>
      </li>

      <li>
        <AimOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__phone">
          {dataDetailInfo && dataDetailInfo.zoneName
            ? dataDetailInfo.zoneName
            : `${intl.formatMessage({ id: 'view.maps.not_provide' })}`}
        </span>
      </li>
    </>
  );

  const renderAdminisUnitInfo = () => (
    <>
      <li>
        <EnvironmentOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc">
          {dataDetailInfo
            ? `${dataDetailInfo.address}, ${
                !isEmpty(dataDetailInfo.wardName) ? `${dataDetailInfo.wardName},` : ''
              } ${dataDetailInfo.districtName},${dataDetailInfo.provinceName}`
            : ''}
        </span>
      </li>

      <li>
        <PhoneOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__detail--phone">
          {dataDetailInfo?.tel ? `+${dataDetailInfo.tel}` : '+XXXXXXXXXX'}
        </span>
      </li>

      <li>
        <AimOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc ">
          {dataDetailInfo && dataDetailInfo.lat_ && dataDetailInfo.long_
            ? `${dataDetailInfo.lat_}/${dataDetailInfo.long_}`
            : `${intl.formatMessage({ id: 'view.maps.not_provide' })}`}
        </span>
      </li>
    </>
  );

  return (
    <Container className="camera-info">
      <div className="camera-info__header">
        {type === TYPE_FORM_ACTION_ON_MAP.cam && (
          <Spin
            tip={intl.formatMessage({ id: 'view.maps.loading' })}
            className="camera-info__header--loading"
            id={`cam-loading-${dataDetailInfo.uuid}`}
            spinning={loading}
          />
        )}
        {type === TYPE_FORM_ACTION_ON_MAP.cam ? (
          <video
            id={`video-slot-${dataDetailInfo.uuid}`}
            className="video-js"
            preload="auto"
            width="100%"
            height="100%"
            poster={imageUrl ? imageUrl : camImgSrcDefault}
            data-setup="{}"
            onPlay={() => setLoading(false)}
          />
        ) : (
          <img
            src={imageUrl ? imageUrl : adUnitImgSrcDefault}
            className="camera-info__header__img"
          />
        )}
        <div className="camera-info__header-action">
          <Button
            icon={<CameraOutlined />}
            onClick={() => {
              startSnapshotCamera(type, dataDetailInfo);
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditInfo(dataDetailInfo)}
            className="middle"
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              onClosePopup(type, dataDetailInfo.uuid);
            }}
          />
        </div>
      </div>
      <Tooltip placement="top" title={dataDetailInfo.name}>
        <h3 className="camera-info__title">
          <span>{dataDetailInfo ? dataDetailInfo.name : ''}</span>
        </h3>
      </Tooltip>
      <div className="camera-detail">
        <ul className="camera-info__detail">
          {type === TYPE_FORM_ACTION_ON_MAP.cam ? renderCamInfo() : renderAdminisUnitInfo()}
        </ul>
      </div>
    </Container>
  );
};

export default CamInfoPopup;
