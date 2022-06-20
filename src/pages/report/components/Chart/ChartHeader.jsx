import { Divider } from 'antd';
import { connect } from 'dva';
import 'moment/locale/en-gb';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import DatePickerForm from './DatePickerForm';

const ChartHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartHeaderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ChartHeaderInfoWrapperTitle = styled.div`
  margin-bottom: 24px;
  @media screen and (max-width: 900px) {
    margin-bottom: 12px;
  }
`;

const ChartHeader = (props) => {
  const [currentPathIsReport, setCurrentPathIsReport] = useState(true);
  let url = useHistory();

  useEffect(() => {
    if (url.location.pathname == '/report' || url.location.pathname == '/report/') {
      setCurrentPathIsReport(true);
    } else {
      setCurrentPathIsReport(false);
    }
  }, []);

  return (
    <>
      {!currentPathIsReport && (
        <ChartHeaderInfo>
          <ChartHeaderInfoWrapper>
            <ChartHeaderInfoWrapperTitle>{props.title}</ChartHeaderInfoWrapperTitle>
            <DatePickerForm title={props.title} typeChart={props.typeChart} />
          </ChartHeaderInfoWrapper>
          <Divider />
        </ChartHeaderInfo>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ChartHeader);
