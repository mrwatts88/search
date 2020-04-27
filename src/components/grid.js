import React, { useState } from 'react';
import GridItem from './gridItem';
import './grid.css';

const rowCount = 20;
const colCount = 40;
const startRow = 10;
const startCol = 8;
const goalRow = 6;
const goalCol = 7;

class GridDataItem {
  constructor(row, col, status, isStart, isGoal) {
    this.row = row;
    this.col = col;
    this.status = status;
    this.isStart = isStart;
    this.isGoal = isGoal;
  }
}

let startDataItem;
let goalDataItem;

const constructGridData = (rows, cols) => {
  startDataItem = new GridDataItem(startRow, startCol, "start", true);
  goalDataItem = new GridDataItem(goalRow, goalCol, "goal", false, true);


  const grid = [];
  for (let j = 0; j < rows; ++j) {
    const row = [];
    for (let i = 0; i < cols; ++i) {
      let status = "pristine";
      if (j === 8) {
        if (i !== 15) {
          row.push(new GridDataItem(j, i, 'wall'));
        } else {
          row.push(new GridDataItem(j, i, status));
        }
      } else if (startRow === j && startCol === i) {
        row.push(startDataItem);
      } else if (goalRow === j && goalCol === i) {
        row.push(goalDataItem);
      } else {
        row.push(new GridDataItem(j, i, status));
      }
    }
    grid.push(row);
  }

  return grid;
}

function* bfs(grid) {
  const stack = [];
  stack.unshift(startDataItem);

  while (stack.length) {
    const current = stack.pop();

    if (current.status === 'goal') {
      return grid;
    }

    if (current.status !== 'visited') {
      if (current.status === 'wall') {
        continue;
      }

      current.status = 'visited';
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          if (current.row + j < 0 || current.row + j >= grid.length || current.col + i < 0 || current.col + i >= grid[0].length) {
            continue;
          }

          if (Math.abs(i) === Math.abs(j)) {
            continue;
          }

          if (grid[current.row + j][current.col + i].status !== 'visited') {
            stack.unshift(grid[current.row + j][current.col + i]);
            grid[current.row + j][current.col + i].prev = current;
          }
        }
      }
      yield grid;
    }
  }

  return grid;
}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

let gridData = constructGridData(rowCount, colCount);
let s = bfs(gridData);
s.next();

function Grid() {
  const forceUpdate = useForceUpdate();

  function reset() {
    gridData = constructGridData(rowCount, colCount);
    s = bfs(gridData);
    s.next();
    forceUpdate();
  }

  function search() {
    for (const next of s) {
      forceUpdate();
    }

    let node = goalDataItem;

    do {
      node.status = 'path';
      node = node.prev;
    } while (node);

    forceUpdate();
  }

  function step() {
    const next = s.next();
    if (next.done) {
      console.log("done");

      let node = goalDataItem;
      do {
        node.status = 'path';
        node = node.prev;
      } while (node);

    }

    forceUpdate();
  }

  return (
    <div>
      <div className="grid">
        {gridData.map((row, idx) => (
          <div key={idx} className="grid-row">
            {row.map((col, i) => (
              <GridItem key={i} gridDataItem={col} />
            ))}
          </div>))
        }
      </div>
      <button onClick={() => { step() }}>Step</button>
      <button onClick={() => { search() }}>Search</button>
      <button onClick={() => { reset() }}>Reset</button>
    </div>
  );
}

export default Grid;

