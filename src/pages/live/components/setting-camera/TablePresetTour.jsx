import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import { EyeOutlined } from '@ant-design/icons';
import { Space, Table } from 'antd';
import { connect } from 'dva';
import styled from 'styled-components';
import { useIntl } from 'umi';
import AddEditPresetTour from './preset-tour/AddEditPresetTour';
import DetailsPresetTour from './preset-tour/DetailsPresetTour';
function TablePresetTour({
  cameraSelected,
  listPreset,
  listPresetTour,
  dispatch,
  showDrawerAddEditPresetTour,
  loading,
  showDrawerDetailsPresetTour,
}) {
  const intl = useIntl();

  const handleShowAddEditPresetTour = () => {
    dispatch({
      type: 'showPresetTourDrawer/openDrawerAddEditPresetTour',
      payload: { selectedPresetTour: null },
    });
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.NO',
      }),
      key: 'index',
      width: '15%',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.name',
      }),
      dataIndex: 'name',
    },
  ];

  const HeaderPresetTour = () => {
    return (
      <StyledHeader>
        <h3>
          {intl.formatMessage({
            id: 'pages.live-mode.noti.list-of-tour-presets',
          })}
        </h3>
        <SpanCode onClick={handleShowAddEditPresetTour}>
          +{' '}
          {intl.formatMessage({
            id: 'pages.live-mode.noti.add-preset-tour',
          })}
        </SpanCode>
      </StyledHeader>
    );
  };

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={listPresetTour}
        pagination={{ pageSize: 10 }}
        title={() => <HeaderPresetTour />}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              dispatch({
                type: 'showPresetTourDrawer/handleShowDrawerDetailsPresetTour',
                payload: { selectedPresetTour: record },
              });
            }, // click row
          };
        }}
      />
      {showDrawerAddEditPresetTour && (
        <AddEditPresetTour showDrawerAddEditPresetTour={showDrawerAddEditPresetTour} />
      )}

      {showDrawerDetailsPresetTour && (
        <DetailsPresetTour showDrawerDetailsPresetTour={showDrawerDetailsPresetTour} />
      )}
    </div>
  );
}

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function mapStateToProps(state) {
  const { listPreset, listPresetTour, loading } = state.live;

  const { showDrawerAddEditPresetTour, showDrawerDetailsPresetTour } = state.showPresetTourDrawer;

  return {
    listPreset,
    listPresetTour,
    showDrawerAddEditPresetTour,
    loading,
    showDrawerDetailsPresetTour,
  };
}

export default connect(mapStateToProps)(TablePresetTour);
