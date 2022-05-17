import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { DrawerActionStyle, DrawerLabelStyle } from '../../style';

const { Paragraph } = Typography;

const DetailZone = ({ onClose, selectedRecord }) => {
  const intl = useIntl();

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.common_device.zone_name',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.name}</p>
          </Paragraph>
        </Col>

        <Col span={12}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.map.province_id',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.provinceName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.map.district_id',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.districtName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.map.ward_id',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.wardName}</p>
          </Paragraph>
        </Col>
        <Col span={12}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.map.address',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.address}</p>
          </Paragraph>
        </Col>

        <Col span={24}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>{`${intl.formatMessage({
              id: 'view.user.detail_list.desc',
            })}`}</DrawerLabelStyle>
            <p>{selectedRecord?.description}</p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>NVR</DrawerLabelStyle>

            <p>
              {selectedRecord?.nvrList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>Playback</DrawerLabelStyle>
            <p>
              {selectedRecord?.playbackList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph className="mt-1">
            <DrawerLabelStyle>Camproxy</DrawerLabelStyle>

            <p>
              {selectedRecord?.campList.map((p) => {
                return `${p.name}/`;
              })}
            </p>
          </Paragraph>
        </Col>
      </Row>
      <DrawerActionStyle>
        <Button onClick={onClose} type="danger">
          {`${intl.formatMessage({
            id: 'view.camera.close',
          })}`}
        </Button>
      </DrawerActionStyle>
    </div>
  );
};

export default DetailZone;
