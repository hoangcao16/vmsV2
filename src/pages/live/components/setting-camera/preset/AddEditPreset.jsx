import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Space } from 'antd';
import styled from 'styled-components';
import { useIntl } from 'umi';

import MSFormItem from '@/components/Form/Item';
import { StyledDrawer } from '@/pages/live/style';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import CameraSlot from '../../CameraSlot';
import Control from '../../rotate/Control';

export const TABS = {
  SETTING: '1',
  CHANGE_PRESET: '2',
  CONTROL: '3',
};

function AddEditPreset({ showDrawerAddEditPreset, cameraSelected, selectedPreset = {}, dispatch }) {

  const intl = useIntl();

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const { name } = values;
    const body = {
      cameraUuid: cameraSelected?.uuid,
      name: name,
    };

    dispatch({
      type: 'live/addPreset',
      payload: { body },
    });

    dispatch({ type: 'showDrawer/closeDrawerAddEditPreset', payload: {} });
  };

  const handleCloseDrawerAddEdit = () => {
    dispatch({ type: 'showDrawer/closeDrawerAddEditPreset', payload: {} });
  };

  return (
    <>
      <StyledDrawer
        openDrawer={showDrawerAddEditPreset}
        onClose={handleCloseDrawerAddEdit}
        width={'80%'}
        zIndex={1003}
        placement="right"
        extra={
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>

            <Button onClick={handleCloseDrawerAddEdit}>
              <CloseOutlined />
              {intl.formatMessage({ id: 'view.map.cancel' })}
            </Button>
          </Space>
        }
      >
        <h3> {isEmpty(selectedPreset) ? 'Thêm preset' : 'Sửa preset'}</h3>
        <h4>{cameraSelected?.name}</h4>
        <StyledDivider />

        <CameraContent>
          {!isEmpty(cameraSelected) && <CameraSlot camera={cameraSelected} inPresetView />}
        </CameraContent>

        <FormControlStyled>
          {' '}
          <Form
            layout="horizontal"
            form={form}
            onFinish={handleSubmit}
            initialValues={selectedPreset ?? {}}
          >
            <Row gutter={16}>
              <Col span={24}>
                <MSFormItem
                  label={isEmpty(selectedPreset) ? 'Thêm preset' : 'Sửa preset'}
                  type="input"
                  name="name"
                  minLength={5}
                  maxLength={255}
                  required={true}
                  width={'100%'}
                >
                  <Input />
                </MSFormItem>
              </Col>
            </Row>
          </Form>
          <Control />
        </FormControlStyled>
      </StyledDrawer>
    </>
  );
}

const CameraContent = styled.div`
  position: relative;
  width: 100%;
  height: 500px !important;
  top: 0;
  left: 0;
  .ant-drawer-body video {
    height: 100% !important;
  }
`;

const FormControlStyled = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ant-form {
    width: 60%;
  }
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 0px;
`;

function mapStateToProps(state) {
  const { cameraSelected } = state.live;
  const { selectedPreset } = state.showDrawer;
  return {
    cameraSelected,
    selectedPreset,
  };
}

export default connect(mapStateToProps)(AddEditPreset);
