import { ClearOutlined } from '@ant-design/icons';
import { Checkbox, Col, Input, Row, Select } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const CleanSetting = () => {
  const intl = useIntl();

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <ClearOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>Thiết lập cấu hình dọn dẹp</h4>
        <p>
          Thiết lập chế độ tự động dọn dẹp giúp đơn vị tối ưu lại bộ nhớ và tiết kiệm chi phí hơn
        </p>
      </Col>
    </Row>
  );

  const optionSelect = [
    <Option key="HOUR" value="HOUR">
      {intl.formatMessage({ id: 'view.storage.hour' })}
    </Option>,
    <Option key="DAY" value="DAY">
      {intl.formatMessage({ id: 'view.storage.day' })}
    </Option>,
    <Option key="MONTH" value="MONTH">
      {intl.formatMessage({ id: 'view.storage.month' })}
    </Option>,
    <Option key="YEAR" value="YEAR">
      {intl.formatMessage({ id: 'view.storage.year' })}
    </Option>,
  ];

  return (
    <>
      <StyledCard title={titleCard}>
        <div className="setting-clean">
          <Row justify="space-between">
            <Col span={8}>
              <Row>
                <Col className="label">
                  <p>{intl.formatMessage({ id: 'view.storage.file_capture' })} :</p>
                </Col>
                <Col span={8}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Select defaultValue="YEAR">{optionSelect}</Select>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col className="label">
                  <p>Tệp lưu hàng ngày :</p>
                </Col>
                <Col span={8}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Select defaultValue="YEAR">{optionSelect}</Select>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col className="label">
                  <p>Tệp sự kiện :</p>
                </Col>
                <Col span={8}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Select defaultValue="YEAR">{optionSelect}</Select>
                </Col>
              </Row>
            </Col>
          </Row>
          <Checkbox>Dọn dẹp tệp quan trọng</Checkbox>
        </div>
      </StyledCard>
    </>
  );
};

export default CleanSetting;
