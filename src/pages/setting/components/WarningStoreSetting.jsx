import { GatewayOutlined } from '@ant-design/icons';
import { Col, Radio, Row, Select, Switch } from 'antd';
import React, { useState } from 'react';
import { StyledCard } from '../style';
const { Option } = Select;

const WarningStoreSetting = () => {
  const [valueRadio, setValueRadio] = useState(0);
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
        <Row className="setting-warn">
          <Col span={12}>
            <Row className="gutter">
              <Col span={5} className="label">
                <p>Nhận cảnh báo lưu ý :</p>
              </Col>
              <Col span={8}>
                <Switch defaultChecked />
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={5} className="label">
                <p>Ngưỡng cảnh báo lưu ý :</p>
              </Col>
              <Col span={8}>
                <Select defaultValue={70}>{percentOption}</Select>
                <p className="note">Khi dung lượng ổ cứng từ</p>
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={5} className="label">
                <p>Tần suất cảnh báo :</p>
              </Col>
              <Col span={8}>
                <Select defaultValue={3}>{hourOption}</Select>
                <p className="note">Chu kỳ gửi lại cảnh báo</p>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>Nhận cảnh báo nguy hiểm :</p>
              </Col>
              <Col span={8}>
                <Switch defaultChecked />
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>Ngưỡng cảnh báo nguy hiểm :</p>
              </Col>
              <Col span={8}>
                <Select defaultValue={70}>{percentOption}</Select>
                <p className="note">Khi dung lượng ổ cứng từ</p>
              </Col>
            </Row>

            <Row className="gutter">
              <Col span={6} className="label">
                <p>Tần suất cảnh báo :</p>
              </Col>
              <Col span={8}>
                <Select defaultValue={3}>{hourOption}</Select>
                <p className="note">Chu kỳ gửi lại cảnh báo</p>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Radio.Group
              value={valueRadio}
              className="autoDelete"
              onChange={(e) => setValueRadio(e.target.value)}
            >
              <Row justify="space-around">
                <Col span={7}>
                  <Radio value={0}>Tự động xóa còn 95% khi bộ nhớ đầy</Radio>
                </Col>
                <Col span={6}>
                  <Radio value={1}>Tự động xóa còn 5GB khi bộ nhớ đầy</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default WarningStoreSetting;
