import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const RecordSetting = ({ list }) => {
  const intl = useIntl();

  const [recordSize, setRecordSize] = useState(list?.recordingVideoSizeSave || 0);

  // useEffect(() => {
  //   settingApi.getRecordingVideo().then(async (data) => {
  //     let convertData = await convertRecordSetitngData(data?.payload);
  //     setRecordSize(convertData);
  //     setLoading(false);
  //     return;
  //   });
  // }, []);

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <FieldTimeOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>{intl.formatMessage({ id: 'view.storage.set_max_archive_file_length' })}</h4>
        <p>{intl.formatMessage({ id: 'view.storage.set_max_archive_file_length_desc' })}</p>
      </Col>
    </Row>
  );

  const secondOptions = [];
  for (let i = 30; i <= 120; i += 30) {
    secondOptions.push(
      <Option key={i} value={i}>
        {i} {intl.formatMessage({ id: 'view.storage.seconds' })}
      </Option>,
    );
  }

  return (
    <>
      <StyledCard
        title={titleCard}
        extra={
          <Button type="primary" onClick={() => console.log(recordSize)}>
            Save
          </Button>
        }
      >
        <Row>
          <Col className="label">
            <p>{intl.formatMessage({ id: 'view.storage.maximum_length_video_archive' })} :</p>
          </Col>
          <Col span={4}>
            <Select onChange={(value) => setRecordSize(value)} value={recordSize}>
              {secondOptions}
            </Select>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default RecordSetting;
