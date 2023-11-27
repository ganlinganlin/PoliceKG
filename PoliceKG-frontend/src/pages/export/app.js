import React from 'react';
import Export from './index.js';
import { Bar } from '@ant-design/plots';

function App() {
  const chartData = {
    labels: ['A', 'B', 'C', 'D', 'E'],
    datasets: [{
      label: '数据',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  return (
    <div>
      <h1>导出数据报告示例</h1>
      <Bar data={chartData} />
      <Export content="<h2>数据报告</h2>" />
    </div>
  );
}

export default App;
