import React from 'react';

function GridItem({ gridDataItem }) {
  const startClass = gridDataItem.isStart ? "grid-item-start" : "";
  const goalClass = gridDataItem.isGoal ? "grid-item-goal" : "";
  return (
    <div className={`grid-item grid-item-${gridDataItem.status} ${startClass} ${goalClass}`} />
  );
}

export default GridItem;

