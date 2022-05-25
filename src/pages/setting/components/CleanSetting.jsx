import { ClearOutlined } from '@ant-design/icons';
import { Checkbox, Col, Input, InputNumber, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const CleanSetting = ({ list }) => {
  const intl = useIntl();
  const [cleanSettingData, setCleanSettingData] = useState(list || {});

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

  const onChangeTimeTypeOne = (value) => {
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[0].timeType = value;

    //set clean setting data
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  return (
    <>
      <StyledCard title={titleCard}>
        <div className="setting-clean">
          <Row justify="space-between">
            <Col span={8} className="capture">
              <Row>
                <Col className="label">
                  <p>{intl.formatMessage({ id: 'view.storage.file_capture' })} :</p>
                </Col>
                <Col span={8}>
                  <InputNumber
                    controls={false}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[0]?.time
                        : 0
                    }
                  />
                </Col>
                <Col span={4}>
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
                <Col span={8}>
                  <InputNumber
                    controls={false}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[1]?.time
                        : 0
                    }
                  />
                </Col>
                <Col span={4}>
                  <Select
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
                <Col span={8}>
                  <InputNumber
                    controls={false}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[1]?.time
                        : 0
                    }
                  />
                </Col>
                <Col span={4}>
                  <Select
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
          <Checkbox checked={cleanSettingData?.autoRemoveFileImportant || false}>
            {intl.formatMessage({ id: 'view.storage.clean_important_file' })}
          </Checkbox>
        </div>
      </StyledCard>
    </>
  );
};

export default CleanSetting;
