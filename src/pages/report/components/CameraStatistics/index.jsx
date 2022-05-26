import cameraApi from '@/services/camera/CameraApi';
import { Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import CameraStatisticsItem from './CameraStatisticsItem';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const CameraStatistics = () => {
  const [camera, setCamera] = useState([]);

  useEffect(() => {
    try {
      cameraApi.getReportCamera().then((result) => {
        if (!isEmpty(result)) {
          const convertData = result.payload.map((r) => {
            return {
              ...r,
              color: getColor(r),
            };
          });
          const sortData = [];
          sortData[0] = convertData.find((i) => i.cameraName == 'totalCamera');
          sortData[1] = convertData.find((i) => i.cameraName == 'cameraAI');
          sortData[2] = convertData.find((i) => i.cameraName == 'cameraIsWorking');
          sortData[3] = convertData.find((i) => i.cameraName == 'cameraIsNotWorking');
          setCamera(sortData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getColor = (r) => {
    if (r.cameraName === 'totalCamera') {
      return '#ff008c';
    }
    if (r.cameraName === 'cameraAI') {
      return '#7721ef';
    }
    if (r.cameraName === 'cameraIsWorking') {
      return '#9bcb21';
    }
    return '#eb000c';
  };

  return (
    <Row gutter={24}>
      {camera.map((c) => {
        return (
          <Col {...topColResponsiveProps}>
            <CameraStatisticsItem
              key={c?.cameraName}
              cameraName={c?.cameraName}
              totalCamera={c?.totalCamera}
              color={c?.color}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default CameraStatistics;
