import { CheckOutlined, CloseOutlined, GatewayOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Select, Switch, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
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

const WarningStoreSetting = ({ list, dispatch, loading }) => {
  const intl = useIntl();
  const [warningDiskData, setWarningDiskData] = useState({});

  const [isError, setIsError] = useState(false);
  const [isSwitchOneTurnOn, setIsSwitchOneTurnOn] = useState(false);
  const [isSwitchTwoTurnOn, setIsSwitchTwoTurnOn] = useState(false);
  const [isVisibleOne, setIsVisibleOne] = useState(false);
  const [isVisibleTwo, setIsVisibleTwo] = useState(false);

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
      if (!loading) {
        let convertedData = await convertWarningDiskData(list);
        setIsSwitchOneTurnOn(!convertedData?.isActiveOne);
        setIsSwitchTwoTurnOn(!convertedData?.isActiveTwo);
        setWarningDiskData(convertedData);
      }
    })();
  }, [loading]);

  const onChangeSwitchOne = (checked) => {
    setIsSwitchOneTurnOn(!checked);
    setWarningDiskData({
      ...warningDiskData,
      isActiveOne: checked,
    });
  };

  const onChangeSwitchTwo = (checked) => {
    setIsSwitchTwoTurnOn(!checked);
    setWarningDiskData({
      ...warningDiskData,
      isActiveTwo: checked,
    });
  };

  const onChangePercentUseOne = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      percentUsedOne: value,
    });
    if (value > warningDiskData?.percentUsedTwo) {
      setIsError(true);
      setIsVisibleOne(true);
      setIsVisibleTwo(false);
    } else {
      setIsError(false);
      setIsVisibleOne(false);
      setIsVisibleTwo(false);
    }
  };

  const onChangePercentUseTwo = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      percentUsedTwo: value,
    });
    if (value < warningDiskData?.percentUsedOne) {
      setIsError(true);
      setIsVisibleTwo(true);
      setIsVisibleOne(false);
    } else {
      setIsError(false);
      setIsVisibleTwo(false);
      setIsVisibleOne(false);
    }
  };

  const onChangeTimeOne = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      timeOne: value,
    });
  };

  const onChangeTimeTwo = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      timeTwo: value,
    });
  };

  const onChangeRadio = (e) => {
    let autoRemovePerFile = e.target.value === 0 ? true : false;
    setWarningDiskData({
      ...warningDiskData,
      autoRemovePerFile: autoRemovePerFile,
      autoRemoveFreeSpaceFile: !autoRemovePerFile,
    });
  };

  const cancel = () => {
    dispatch({ type: 'setting/fetchWarningStoreSetting' });
  };

  const confirm = () => {
    let payload = JSON.parse(JSON.stringify(warningDiskData));
    const data = {
      autoRemoveFreeSpaceFile: payload?.autoRemoveFreeSpaceFile,
      autoRemovePerFile: payload?.autoRemovePerFile,
      configWarningDisk: {
        percentUsedOne: payload?.percentUsedOne || 0,
        timeOne: payload?.timeOne || 0,
        isActiveOne: payload?.isActiveOne || false,
        percentUsedTwo: payload?.percentUsedTwo || 0,
        timeTwo: payload?.timeTwo || 0,
        isActiveTwo: payload?.isActiveTwo || false,
      },
    };
    dispatch({ type: 'setting/postDataWarningDisk', payload: data });
  };

  return (
    <>
      <StyledCard
        title={titleCard}
        extra={
          <>
            <Button key="close" className="cancel" onClick={cancel}>
              <CloseOutlined />
              {intl.formatMessage({ id: 'view.map.cancel' })}
            </Button>
            <Button type="primary" className="save" key="save" disabled={isError} onClick={confirm}>
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
          </>
        }
      >
        <Row className="setting-warn">
          {/* attention */}
          <Col span={12} className="attention">
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.receive_attention' })} :</p>
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="right"
                  title={intl.formatMessage({ id: 'view.storage.not_be_warned' })}
                  visible={isSwitchOneTurnOn}
                  color={'gold'}
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={!isSwitchOneTurnOn}
                    onChange={onChangeSwitchOne}
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.attention_threshold' })} :</p>
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="topLeft"
                  title={intl.formatMessage({ id: 'view.storage.greater_than_level_2' })}
                  visible={isVisibleOne}
                  color={'red'}
                >
                  <Select
                    value={warningDiskData?.percentUsedOne}
                    onChange={onChangePercentUseOne}
                    disabled={isSwitchOneTurnOn}
                  >
                    {percentOption}
                  </Select>
                </Tooltip>

                <p className="note">{intl.formatMessage({ id: 'view.storage.hard_drive_from' })}</p>
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.alarm_frequency' })} :</p>
              </Col>
              <Col span={8}>
                <Select
                  value={warningDiskData?.timeOne}
                  onChange={onChangeTimeOne}
                  disabled={isSwitchOneTurnOn}
                >
                  {hourOption}
                </Select>
                <p className="note">
                  {intl.formatMessage({ id: 'view.storage.alarm_resend_cycle' })}
                </p>
              </Col>
            </Row>
          </Col>
          {/* danger */}
          <Col span={12} className="danger">
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.receive_danger' })} :</p>
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="right"
                  title={intl.formatMessage({ id: 'view.storage.not_be_warned' })}
                  visible={isSwitchTwoTurnOn}
                  color={'gold'}
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={!isSwitchTwoTurnOn}
                    onChange={onChangeSwitchTwo}
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.danger_threshold' })} :</p>
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="topLeft"
                  title={intl.formatMessage({ id: 'view.storage.smaller_than_level_1' })}
                  visible={isVisibleTwo}
                  color={'red'}
                >
                  <Select
                    value={warningDiskData?.percentUsedTwo}
                    onChange={onChangePercentUseTwo}
                    disabled={isSwitchTwoTurnOn}
                  >
                    {percentOption}
                  </Select>
                </Tooltip>

                <p className="note">{intl.formatMessage({ id: 'view.storage.hard_drive_from' })}</p>
              </Col>
            </Row>

            <Row className="gutter">
              <Col span={6} className="label">
                <p>{intl.formatMessage({ id: 'view.storage.alarm_frequency' })} :</p>
              </Col>
              <Col span={8}>
                <Select
                  value={warningDiskData?.timeTwo}
                  onChange={onChangeTimeTwo}
                  disabled={isSwitchTwoTurnOn}
                >
                  {hourOption}
                </Select>
                <p className="note">
                  {intl.formatMessage({ id: 'view.storage.alarm_resend_cycle' })}
                </p>
              </Col>
            </Row>
          </Col>
          {/* auto remove */}
          <Col span={24}>
            <Radio.Group
              value={warningDiskData?.autoRemoveFreeSpaceFile ? 1 : 0}
              className="autoDelete"
              onChange={onChangeRadio}
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
