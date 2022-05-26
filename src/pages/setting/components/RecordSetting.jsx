import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Select } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const RecordSetting = ({ list, dispatch }) => {
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

  const confirm = async () => {
    dispatch({
      type: 'setting/postRecordSetting',
      payload: {
        ...list,
        recordingVideoSizeSave: recordSize,
      },
    });
  };

  return (
    <>
      <StyledCard
        title={titleCard}
        extra={
          <Popconfirm
            placement="leftTop"
            title={intl.formatMessage({ id: 'noti.save_change' })}
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Save</Button>
          </Popconfirm>
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
