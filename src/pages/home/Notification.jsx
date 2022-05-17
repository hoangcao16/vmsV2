import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { useIntl } from 'umi';
import InfiniteScroll from 'react-infinite-scroll-component';

const Notification = (props) => {
  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  useEffect(() => {
    fetchData();
  }, [pagination]);

  const fetchData = () => {
    props.dispatch({
      type: 'noti/fetchData',
      payload: pagination,
    });
  };

  const handleNext = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={props?.list.length}
        next={handleNext}
        hasMore={pagination.page < 3}
        height={300}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {props.list.map((_, index) => (
          <div
            style={{
              margin: '10px 5px',
              background: '#ccc',
              padding: '10px',
            }}
            key={index}
          >
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    list: state.noti.list || [],
  };
}

export default connect(mapStateToProps)(Notification);
