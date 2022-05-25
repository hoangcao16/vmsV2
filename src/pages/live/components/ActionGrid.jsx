import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as Grid1 } from '../../../assets/img/grid1.svg';
import { ReactComponent as Grid2 } from '../../../assets/img/grid2.svg';
import { ReactComponent as Grid3 } from '../../../assets/img/grid3.svg';
import { ReactComponent as Grid4 } from '../../../assets/img/grid4.svg';

const ActionGrid = ({ grid, onChange }) => {
  const [current, setCurrent] = useState(GRID1X1);

  useEffect(() => {
    setCurrent(grid);
  }, [grid]);

  const handleChange = (key) => {
    setCurrent(key);
    onChange && onChange(key);
  };

  return (
    <StyledGrid>
      <StyledGridItem active={current === GRID1X1} onClick={() => handleChange(GRID1X1)} first>
        <Grid1 />
      </StyledGridItem>
      <StyledGridItem active={current === GRID2X2} onClick={() => handleChange(GRID2X2)}>
        <Grid2 />
      </StyledGridItem>
      <StyledGridItem active={current === GRID3X3} onClick={() => handleChange(GRID3X3)}>
        <Grid3 />
      </StyledGridItem>
      <StyledGridItem active={current === GRID4X4} onClick={() => handleChange(GRID4X4)}>
        <Grid4 />
      </StyledGridItem>
    </StyledGrid>
  );
};

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
`;

const StyledGridItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  --darkreader-inline-fill: ${(prop) => (prop.active ? '#1890FF' : '#595959')};
  color: ${(prop) => (prop.active ? '#1890FF' : '#595959')};
  cursor: pointer;

  svg {
    rect {
      --darkreader-inline-fill: currentColor !important;
    }

    rect:nth-child(2) {
      --darkreader-inline-fill: ${(prop) => (prop.first ? '#1F1F1F' : 'currentColor')} !important;
    }
  }
`;

export default ActionGrid;
