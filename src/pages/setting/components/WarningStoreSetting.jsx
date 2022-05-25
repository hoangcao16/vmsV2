import { CheckOutlined, CloseOutlined, GatewayOutlined } from '@ant-design/icons';
import { Col, Radio, Row, Select, Switch } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';
const { Option } = Select;

const DEFAULT_DATA = {
  percentUsedOne: 0,
  timeOne: 0,
  isActiveOne: false,
  percentUsedTwo: 0,
  timeTwo: 0,
  isActiveTwo: false,
  autoRemovePerFile: true,
  autoRemoveFreeSpaceFile: false,
};
//convertData
const convertWarningDiskData = (data) => {
  if (isEmpty(data)) {
    return [];
  }
  let result;
  result = {
    percentUsedOne: data?.configWarningDisk?.percentUsedOne || DEFAULT_DATA.percentUsedOne,
    timeOne: data?.configWarningDisk?.timeOne || DEFAULT_DATA.timeOne,
    isActiveOne: data?.configWarningDisk?.isActiveOne || DEFAULT_DATA.isActiveOne,
    percentUsedTwo: data?.configWarningDisk?.percentUsedTwo || DEFAULT_DATA.percentUsedTwo,
    timeTwo: data?.configWarningDisk?.timeTwo || DEFAULT_DATA.timeTwo,
    isActiveTwo: data?.configWarningDisk?.isActiveTwo || DEFAULT_DATA.isActiveTwo,
    autoRemovePerFile: data?.autoRemovePerFile || DEFAULT_DATA.autoRemovePerFile,
    autoRemoveFreeSpaceFile: data?.autoRemoveFreeSpaceFile || DEFAULT_DATA.autoRemoveFreeSpaceFile,
  };
  return result;
};

const WarningStoreSetting = ({ list }) => {
  const intl = useIntl();
  const [warningDiskData, setWarningDiskData] = useState({});

  const [percentUsedOne, setPercentUsedOne] = useState(0);
  const [percentUsedTwo, setPercentUsedTwo] = useState(0);

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <GatewayOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>{intl.formatMessage({ id: 'view.storage.what_is_sts' })}</h4>
        <p>{intl.formatMessage({ id: 'view.storage.sts_desc' })}</p>
      </Col>
    </Row>
  );

  const hourOption = [];
  for (let i = 1; i <= 24; i++) {
    hourOption.push(
      <Option key={i} value={i}>
        {i} {intl.formatMessage({ id: 'view.storage.hour' })}
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

  useEffect(() => {
    (async () => {
      let convertedData = await convertWarningDiskData(list);
      setPercentUsedTwo(convertedData?.percentUsedTwo);
      setPercentUsedOne(convertedData?.percentUsedOne);
      setWarningDiskData(convertedData);
    })();
  }, []);

  return (
    <>
      <StyledCard title={titleCard}>
        <Row className="setting-warn">
          <Col span={12} className="attention">
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.receive_attention' })} :</p>
              </Col>
              <Col span={8}>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={warningDiskData?.isActiveOne}
                />
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.attention_threshold' })} :</p>
              </Col>
              <Col span={8}>
                <Select value={percentUsedOne}>{percentOption}</Select>
                <p className="note">{intl.formatMessage({ id: 'view.storage.hard_drive_from' })}</p>
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.alarm_frequency' })} :</p>
              </Col>
              <Col span={8}>
                <Select value={warningDiskData?.timeOne}>{hourOption}</Select>
                <p className="note">
                  {intl.formatMessage({ id: 'view.storage.alarm_resend_cycle' })}
                </p>
              </Col>
            </Row>
          </Col>
          <Col span={12} className="danger">
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.receive_danger' })} :</p>
              </Col>
              <Col span={8}>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={warningDiskData?.isActiveTwo}
                />
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.danger_threshold' })} :</p>
              </Col>
              <Col span={8}>
                <Select value={percentUsedTwo}>{percentOption}</Select>
                <p className="note">{intl.formatMessage({ id: 'view.storage.hard_drive_from' })}</p>
              </Col>
            </Row>

            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.alarm_frequency' })} :</p>
              </Col>
              <Col span={8}>
                <Select value={warningDiskData?.timeTwo}>{hourOption}</Select>
                <p className="note">
                  {intl.formatMessage({ id: 'view.storage.alarm_resend_cycle' })}
                </p>
              </Col>
            </Row>
          </Col>
          {/*  */}
          <Col span={24}>
            <Radio.Group
              value={warningDiskData?.autoRemoveFreeSpaceFile ? 1 : 0}
              className="autoDelete"
              // onChange={(e) => setValueRadio(e.target.value)}
            >
              <Row justify="space-around">
                <Col span={6}>
                  <Radio value={0}>
                    {intl.formatMessage({ id: 'view.storage.automatically_95_percent' })}
                  </Radio>
                </Col>
                <Col span={6}>
                  <Radio value={1}>
                    {intl.formatMessage({ id: 'view.storage.automatically_5gb' })}
                  </Radio>
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
