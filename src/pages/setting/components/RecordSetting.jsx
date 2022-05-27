import { CloseOutlined, FieldTimeOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const { Option } = Select;

const RecordSetting = ({ list, dispatch, loading }) => {
  const intl = useIntl();

  const [recordSize, setRecordSize] = useState(0);

  useEffect(() => {
    if (!loading) {
      setRecordSize(list?.recordingVideoSizeSave);
    }
  }, [loading]);

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
    await dispatch({
      type: 'setting/postRecordSetting',
      payload: {
        ...list,
        recordingVideoSizeSave: recordSize,
      },
    });
    setRecordSize(recordSize);
    dispatch({
      type: 'setting/fetchRecordSetting',
    });
  };

  const cancel = () => {
    setRecordSize(list?.recordingVideoSizeSave);
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
            <Button type="primary" className="save" key="save" onClick={confirm}>
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
          </>
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
