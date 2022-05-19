import { FieldTimeOutlined } from '@ant-design/icons';
import { Col, Row, Select } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const RecordSetting = () => {
  const intl = useIntl();

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <FieldTimeOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>{intl.formatMessage({ id: 'view.storage.set_max_archive_file_length' })}</h4>
        <p>Thiết lập thời lượng ghi hình tối đa cho video lưu trữ</p>
      </Col>
    </Row>
  );

  const secondOptions = [];
  for (let i = 30; i <= 120; i += 30) {
    secondOptions.push(
      <Option key={i} value={i}>
        {i} giây
      </Option>,
    );
  }

  return (
    <>
      <StyledCard title={titleCard}>
        <Row>
          <Col className="label">
            <p>Độ dài tối đa :</p>
          </Col>
          <Col span={4}>
            <Select defaultValue={120}>{secondOptions}</Select>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default RecordSetting;
