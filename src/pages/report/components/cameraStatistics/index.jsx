import React, { useEffect, useState } from 'react';
import { Col, Row, Tooltip } from 'antd';
import cameraApi from '@/services/camera/CameraApi';
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
    cameraApi.getReportCamera().then((result) => {
      const convertData =
        result &&
        result.map((r) => {
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
    });
  }, []);

  const getColor = (r) => {
    if (r.cameraName === 'totalCamera') {
      return 'totalCamera';
    }
    if (r.cameraName === 'cameraAI') {
      return 'cameraAI';
    }
    if (r.cameraName === 'cameraIsWorking') {
      return 'cameraIsWorking';
    }
    return 'cameraIsNotWorking';
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
