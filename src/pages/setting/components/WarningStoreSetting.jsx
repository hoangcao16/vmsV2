import { GatewayOutlined } from '@ant-design/icons';
import { Col, Row, Select } from 'antd';
import React from 'react';
import { StyledCard } from '../style';
const { Option } = Select;

const WarningStoreSetting = () => {
  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <GatewayOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>Thiết lập cấu hình ngưỡng lưu trữ</h4>
        <p>
          Thiết lập nhận cảnh báo khi dung lượng lưu trữ sắp hết. Bạn sẽ nhận được cảnh báo về tình
          trạng dung lượng lưu trữ còn lại và thời gian sử dụng còn lại dự kiến.
        </p>
      </Col>
    </Row>
  );

  const hourOption = [];
  for (let i = 1; i <= 24; i++) {
    hourOption.push(
      <Option key={i} value={i}>
        {i} giờ
      </Option>,
    );
  }

  const percentOption = [];
  for (let i = 1; i <= 99; i++) {
    percentOption.push(
      <Option key={i} value={i}>
        {i}%
      </Option>,
    );
  }

  return (
    <>
      <StyledCard title={titleCard}>
        <Row>
          <Col span={12}>
            <Row>
              <Col className="label">
                <p>Độ dài tối đa :</p>
              </Col>
              <Col span={4}></Col>
            </Row>
            <Row>
              <Col className="label">
                <p>Độ dài tối đa :</p>
              </Col>
              <Col span={4}>
                <Select defaultValue={70}>{percentOption}</Select>
              </Col>
            </Row>
            <Row>
              <Col className="label">
                <p>Độ dài tối đa :</p>
              </Col>
              <Col span={4}>
                <Select defaultValue={3}>{hourOption}</Select>
              </Col>
            </Row>
          </Col>
          <Col span={12}></Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default WarningStoreSetting;
