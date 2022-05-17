import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { useIntl } from 'umi';
import InfiniteScroll from 'react-infinite-scroll-component';

const Notification = (props) => {
  useEffect(() => {
    let params = { page: 1, size: 10 };
    props.dispatch({
      type: 'noti/fetchData',
      payload: params,
    });
  }, []);
  return <div>Notification</div>;
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Notification);
