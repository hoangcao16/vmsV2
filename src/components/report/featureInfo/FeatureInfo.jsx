import React, { useEffect, useState } from 'react';
import { Col, Row, Tooltip } from 'antd';
import cameraApi from '@/services/camera/CameraApi';
import FeatureInfoItem from './FeatureInfoItem';

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

let array = [
  { cameraName: 'cameraIsWorking', totalCamera: 31 },
  { cameraName: 'cameraIsNotWorking', totalCamera: 4 },
  { cameraName: 'cameraAI', totalCamera: 1 },
  { cameraName: 'totalCamera', totalCamera: 35 },
];

const sortData = [];
sortData[0] = array[3];
sortData[1] = array[2];
sortData[2] = array[0];
sortData[3] = array[1];

const FeatureInfo = () => {
  const [camera, setCamera] = useState([]);
  console.log('camera', camera);

  useEffect(() => {
    cameraApi.getReportCamera().then((result) => {
      const convertData = result.map((r) => {
        return {
          ...r,
          color: getColor(r),
        };
      });
      const sortData = [];
      sortData[0] = convertData[3];
      sortData[1] = convertData[2];
      sortData[2] = convertData[0];
      sortData[3] = convertData[1];
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
            <FeatureInfoItem
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

export default FeatureInfo;
