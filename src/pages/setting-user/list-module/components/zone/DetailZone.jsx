import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

const { Paragraph } = Typography;

const DetailZone = ({ onClose, selectedRecord }) => {
  const intl = useIntl();

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.common_device.zone_name',
            })}`}</p>
            <p>{selectedRecord?.name}</p>
          </Paragraph>
        </Col>

        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.province_id',
            })}`}</p>
            <p>{selectedRecord?.provinceName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.district_id',
            })}`}</p>
            <p>{selectedRecord?.districtName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.ward_id',
            })}`}</p>
            <p>{selectedRecord?.wardName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.map.address',
            })}`}</p>
            <p>{selectedRecord?.address}</p>
          </Paragraph>
        </Col>

        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>{`${intl.formatMessage({
              id: 'view.user.detail_list.desc',
            })}`}</p>
            <p>{selectedRecord?.description}</p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>NVR</p>

            <p>
              {selectedRecord?.nvrList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>Playback</p>
            <p>
              {selectedRecord?.playbackList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <p style={{ fontWeight: 600, fontSize: 14 }}>Camproxy</p>

            <p>
              {selectedRecord?.campList.map((p) => {
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
          {`${intl.formatMessage({
            id: 'view.camera.close',
          })}`}
        </Button>
      </div>
    </div>
  );
};

export default DetailZone;
