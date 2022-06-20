import { connect } from 'dva';
import React from 'react';

const AddEditPresetTour = () => {
  return <div>AddEditPresetTour</div>;
};

function mapStateToProps(state) {
  console.log('state', state);
  return;
}

export default connect(mapStateToProps)(AddEditPresetTour);
