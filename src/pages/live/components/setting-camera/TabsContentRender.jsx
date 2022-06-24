import React from 'react';
import styled from 'styled-components';
export default function TabsContentRender({ icon, title, description }) {
  return (
    <TabsRender>
      <div className="icon-data"> {icon}</div>
      <div className="content">
        <h3 className="title">{title}</h3>
        <div className="description">{description}</div>
      </div>
    </TabsRender>
  );
}

const TabsRender = styled.div`
  display: flex;
  align-items: center;
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
    .title {
    }
    .description {
      color: white;
      font-size: 14px;
    }
  }
`;
