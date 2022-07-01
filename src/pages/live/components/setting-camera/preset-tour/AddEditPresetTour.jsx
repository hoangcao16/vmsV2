import { StyledDrawer } from '@/components/LiveFullScreen/style';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { CloseOutlined, DeleteOutlined, MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popconfirm, Select, Space, Table, Empty } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { connect } from 'dva';
import { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styled from 'styled-components';
import { useIntl } from 'umi';

const { Option } = Select;

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const data = [];
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const AddEditPresetTour = ({
  showDrawerAddEditPresetTour,
  selectedPresetTour,
  listPreset,
  cameraSelected,
  dispatch,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(selectedPresetTour?.listPoint ?? []);
  const [count, setCount] = useState(0);

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record, index) => (
        <Select
          width={'100%'}
          defaultValue={record.name}
          dataSource={listPreset}
          filterOption={filterOption}
          options={normalizeOptions('name', 'name', listPreset)}
          onChange={(e) => handleOnChange('name', index, e)}
        />
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timeDelay',
      render: (_, record, index) => (
        <>
          <Select
            defaultValue={record.timeDelay}
            onChange={(e) => handleOnChange('timeDelay', index, e)}
          >
            <Option value={5}>5s</Option>
            <Option value={10}>10s</Option>
            <Option value={15}>15s</Option>
            <Option value={20}>20s</Option>
            <Option value={30}>30s</Option>
          </Select>
        </>
      ),
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record, index) => (
        <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.index)}>
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      for (let j = 0; j < newData?.length; j++) {
        if (newData[j].index !== newData.indexOf(newData[j])) {
          newData[j].index = newData.indexOf(newData[j]);
          newData[j].STT = newData[j].index + 1;
        }
      }
      setDataSource(newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const handleCloseDrawerAddEdit = () => {
    dispatch({ type: 'showPresetTourDrawer/closeDrawerAddEditPresetTour', payload: {} });
  };

  const handleDelete = (index) => {
    const newData = dataSource.filter((item) => item.index !== index);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData = {
      index: count,
      STT: count + 1,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleOnChange = (key, index, e) => {
    let newSource = [...dataSource];

    if (key === 'name') {
      const choosePreset = listPreset.find((preset) => preset?.name === e);
      const presetId = choosePreset?.idPreset;
      newSource[index]['idPreset'] = presetId;
    }

    newSource[index][key] = e;
    newSource[index]['speed'] = 1;

    setDataSource(newSource);
  };

  return (
    <StyledDrawer
      openDrawer={showDrawerAddEditPresetTour}
      onClose={handleCloseDrawerAddEdit}
      width={'100%'}
      zIndex={1100}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              const values = form.getFieldValue();

              const body = {
                ...values,
                cameraUuid: cameraSelected?.uuid,
                idPresetTour: selectedPresetTour?.idPresetTour ?? '',
                listPoint: [...dataSource],
              };

              dispatch({
                type: 'live/addPresetTour',
                payload: { body },
              });

              dispatch({ type: 'showPresetTourDrawer/closeDrawerAddEditPresetTour', payload: {} });
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
      <Wrapper>
        <span>Tên Preset tour:</span>
        <Form form={form} initialValues={selectedPresetTour ?? {}}>
          <Form.Item name="name">
            <Input required />
          </Form.Item>
        </Form>
        <TableWrapper>
          <Table
            pagination={false}
            dataSource={dataSource}
            locale={{
              emptyText: (
                <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />
              ),
            }}
            columns={columns}
            rowKey="index"
            scroll={{ y: 500 }}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </TableWrapper>
        <Button onClick={handleAdd} type="primary">
          Add a row
        </Button>
      </Wrapper>
    </StyledDrawer>
  );
};

const Wrapper = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const TableWrapper = styled.div`
  height: 600px;
  .ant-select {
    width: 100%;
  }
`;

function mapStateToProps(state) {
  const { listPreset } = state?.live;
  const { cameraSelected } = state.live;
  const { selectedPresetTour } = state?.showPresetTourDrawer;
  return { listPreset, selectedPresetTour, cameraSelected };
}

export default connect(mapStateToProps)(AddEditPresetTour);
