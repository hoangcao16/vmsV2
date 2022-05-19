import { NotificationOutlined } from '@ant-design/icons';
import { Col, Row, Select } from 'antd';
import React from 'react';
import { StyledCard } from '../style';
const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const EmailConfig = () => {
  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <NotificationOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>Thiết lập email nhận thông báo</h4>
        <p>Thiết lập danh sách email người nhận thông báo từ hệ thống</p>
      </Col>
    </Row>
  );
  return (
    <>
      <StyledCard title={titleCard}>
        <Row>
          <Col className="label">
            <p>Danh sách email nhận :</p>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={['a10', 'c12']}
            >
              {children}
            </Select>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default EmailConfig;
