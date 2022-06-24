import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import PTZApi from '@/services/ptz/PTZApi';
import { Radio, Select } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CameraSlot from '../CameraSlot';
import Control from '../rotate/Control';

import { TABS } from '../SettingPresetDrawer';

const TYPE = { PRESET: 1, PRESET_TOUR: 2 };
function PressetView({
  dispatch,
  cameraSelected,
  listPreset,
  listPresetTour,
  tabActive,
  inDrawer = false,
}) {
  const [value, setValue] = useState(TYPE.PRESET);

  const onChangeType = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {}, []);

  const onChangePresetTour = async (idPresetTour) => {
    const body = {
      cameraUuid: cameraSelected?.uuid,
      idPresetTour: idPresetTour,
    };
    try {
      await PTZApi.callPresetTour(body);
    } catch (error) {}
  };

  const onChangePreset = async (idPreset) => {
    const body = {
      cameraUuid: cameraSelected?.uuid,
      idPreset: idPreset,
    };
    try {
      await PTZApi.callPreset(body);
    } catch (error) {}
  };

  return (
    <>
      <CameraContent>
        {!isEmpty(cameraSelected) && <CameraSlot camera={cameraSelected} />}
      </CameraContent>

      {tabActive === TABS.SETTING && (
        <>
          {' '}
          <PaddingContent>
            <Radio.Group onChange={onChangeType} value={value}>
              <Radio value={TYPE.PRESET}>Preset</Radio>
              <Radio value={TYPE.PRESET_TOUR}>Preset tour</Radio>
            </Radio.Group>
          </PaddingContent>
          {value === TYPE.PRESET ? (
            <SelectStyled
              dataSource={listPreset}
              onChange={(presetId) => onChangePreset(presetId)}
              filterOption={filterOption}
              options={normalizeOptions('name', 'idPreset', listPreset)}
              allowClear
              defaultValue=""
              id="idPreset"
            />
          ) : (
            <SelectStyled
              defaultValue=""
              dataSource={listPresetTour}
              onChange={(presetTourId) => onChangePresetTour(presetTourId)}
              filterOption={filterOption}
              options={normalizeOptions('name', 'idPresetTour', listPresetTour)}
              allowClear
              id="idPresetTour"
            />
          )}
        </>
      )}
      {tabActive === TABS.CONTROL && (
        <PaddingContent>
          <Control />
        </PaddingContent>
      )}
    </>
  );
}

const CameraContent = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  top: 0;
  left: 0;
`;

const PaddingContent = styled.div`
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40%;
  margin: 0 auto;
`;
const SelectStyled = styled(Select)`
  width: 100%;
`;

function mapStateToProps(state) {
  const { cameraSelected, listPreset, listPresetTour } = state.live;

  return {
    cameraSelected,
    listPreset,
    listPresetTour,
  };
}

export default connect(mapStateToProps)(PressetView);
