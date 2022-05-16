import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

const { Paragraph } = Typography;

const DetailZone = ({ onClose, selectedZoneDetail }) => {
  const intl = useIntl();
  console.log('selectedZoneDetail', selectedZoneDetail);

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.common_device.zone_name',
            })}`}</p>
            <p>{selectedZoneDetail?.name}</p>
          </Paragraph>
        </Col>

        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.province_id',
            })}`}</p>
            <p>{selectedZoneDetail?.provinceName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.district_id',
            })}`}</p>
            <p>{selectedZoneDetail?.districtName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.ward_id',
            })}`}</p>
            <p>{selectedZoneDetail?.wardName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.address',
            })}`}</p>
            <p>{selectedZoneDetail?.address}</p>
          </Paragraph>
        </Col>

        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.user.detail_list.desc',
            })}`}</p>
            <p>{selectedZoneDetail?.description}</p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>NVR</p>

            <p>
              {selectedZoneDetail?.nvrList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>Playback</p>
            <p>
              {selectedZoneDetail?.playbackList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>Camproxy</p>

            <p>
              {selectedZoneDetail?.campList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
      </Row>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={onClose} type="danger">
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default DetailZone;
