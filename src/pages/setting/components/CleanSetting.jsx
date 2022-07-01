import { ClearOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Input, Row, Select, Tooltip } from 'antd';
import { isEmpty, parseInt } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const CleanSetting = ({ list, dispatch, loading }) => {
  const intl = useIntl();
  const [cleanSettingData, setCleanSettingData] = useState({});
  const [isCorrectFormatValueOne, setIsCorrectFormatValueOne] = useState(false);
  const [isCorrectFormatValueTwo, setIsCorrectFormatValueTwo] = useState(false);
  const [isCorrectFormatValueThree, setIsCorrectFormatValueThree] = useState(false);
  const [checkHandleSubmit, setHandleSubmit] = useState(false);

  useEffect(() => {
    if (!loading) {
      setCleanSettingData(list);
    }
  }, [loading]);

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <ClearOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>{intl.formatMessage({ id: 'view.storage.what_is_cs' })}</h4>
        <p>{intl.formatMessage({ id: 'view.storage.cs_desc' })}</p>
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

  const onChangeTimeOne = (e) => {
    const value = e.target.value;
    let configCleanFileNew = cleanSettingData?.configCleanFile;
    configCleanFileNew[0].time = value === '' ? '' : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });

    if (isEmpty(value)) {
      setIsCorrectFormatValueOne(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueOne(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeTwo = (e) => {
    const value = e.target.value;
    let configCleanFileNew = cleanSettingData?.configCleanFile;
    configCleanFileNew[1].time = value === '' ? '' : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });

    if (isEmpty(value)) {
      setIsCorrectFormatValueTwo(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueTwo(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeThere = (e) => {
    const value = e.target.value;
    let configCleanFileNew = cleanSettingData?.configCleanFile;
    configCleanFileNew[2].time = value === '' ? '' : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });

    if (isEmpty(value)) {
      setIsCorrectFormatValueThree(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueThree(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeTypeOne = (value) => {
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[0].timeType = value;

    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeTimeTypeTwo = (value) => {
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[1].timeType = value;

    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeTimeTypeThere = (value) => {
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[2].timeType = value;

    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeCheckbox = (e) => {
    setCleanSettingData({
      ...cleanSettingData,
      autoRemoveFileImportant: e.target.checked,
    });
  };

  const confirm = async () => {
    await dispatch({
      type: 'setting/postCleanSetting',
      payload: cleanSettingData,
    });
    dispatch({
      type: 'setting/fetchCleanSetting',
    });
  };

  const cancel = () => {
    dispatch({
      type: 'setting/fetchCleanSetting',
    });
    setCleanSettingData(list);
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
            <Button
              type="primary"
              className="save"
              key="save"
              disabled={checkHandleSubmit}
              onClick={confirm}
            >
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
          </>
        }
      >
        <div className="setting-clean">
          <Row justify="space-between">
            <Col span={8} className="capture">
              <Row>
                <Col className="label">
                  <p>{intl.formatMessage({ id: 'view.storage.file_capture' })} :</p>
                </Col>
                <Col span={10}>
                  <Tooltip
                    placement="topLeft"
                    title={intl.formatMessage({ id: 'noti.enter_this_field' })}
                    visible={isCorrectFormatValueOne}
                    color={'red'}
                  >
                    <Input
                      name="setting"
                      type="number"
                      onChange={onChangeTimeOne}
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                      }
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[0]?.time
                          : ''
                      }
                    />
                  </Tooltip>
                </Col>
                <Col span={5}>
                  <Select
                    onChange={onChangeTimeTypeOne}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[0]?.timeType
                        : 'YEAR'
                    }
                  >
                    {optionSelect}
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col span={8} className="event">
              <Row>
                <Col className="label">
                  <p>{intl.formatMessage({ id: 'view.storage.autosave_file' })} :</p>
                </Col>
                <Col span={10}>
                  <Tooltip
                    placement="topLeft"
                    title={intl.formatMessage({ id: 'noti.enter_this_field' })}
                    visible={isCorrectFormatValueTwo}
                    color={'red'}
                  >
                    <Input
                      name="cleanSetting"
                      type="number"
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                      }
                      onChange={onChangeTimeTwo}
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[1]?.time
                          : ''
                      }
                    />
                  </Tooltip>
                </Col>
                <Col span={5}>
                  <Select
                    onChange={onChangeTimeTypeTwo}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[1]?.timeType
                        : 'YEAR'
                    }
                  >
                    {optionSelect}
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col span={8} className="daily-record">
              <Row>
                <Col className="label">
                  <p>{intl.formatMessage({ id: 'view.storage.event_file' })} :</p>
                </Col>
                <Col span={10}>
                  <Tooltip
                    placement="topLeft"
                    title={intl.formatMessage({ id: 'noti.enter_this_field' })}
                    visible={isCorrectFormatValueThree}
                    color={'red'}
                  >
                    <Input
                      name="dataSetting"
                      type="number"
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                      }
                      onChange={onChangeTimeThere}
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[2]?.time
                          : ''
                      }
                    />
                  </Tooltip>
                </Col>
                <Col span={5}>
                  <Select
                    onChange={onChangeTimeTypeThere}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[2]?.timeType
                        : 'YEAR'
                    }
                  >
                    {optionSelect}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
          <Checkbox
            checked={cleanSettingData?.autoRemoveFileImportant || false}
            onChange={onChangeCheckbox}
          >
            {intl.formatMessage({ id: 'view.storage.clean_important_file' })}
          </Checkbox>
        </div>
      </StyledCard>
    </>
  );
};

export default CleanSetting;
