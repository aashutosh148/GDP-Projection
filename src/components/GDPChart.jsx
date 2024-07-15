import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GDPChart = ({ chartData, categories }) => {
  const chartOptions = {
    chart: {
      background: '#1F2937',
      foreColor: '#E5E7EB',
      toolbar: { show: false }
    },
    xaxis: {
      categories: categories,
      labels: { style: { colors: '#E5E7EB' } },
      axisBorder: { color: '#4B5563' },
      axisTicks: { color: '#4B5563' }
    },
    yaxis: {
      title: {
        text: 'GDP (Billion USD)',
        style: { color: '#E5E7EB' },
      },
      labels: { style: { colors: '#E5E7EB' } },
    },
    grid: {
      borderColor: '#4B5563',
      yaxis: { lines: { show: true } },
    },
    // title: {
    //   text: 'Projection Chart',
    //   align: 'center',
    //   style: {
    //     fontSize: '20px',
    //     color: '#E5E7EB',
    //   },
    // },
    theme: { mode: 'dark' },
    stroke: { curve: 'smooth', width: 2 },
    legend: {
      labels: { colors: '#E5E7EB' },
    },
  };

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="line"
      height={500}
    />
  );
};

export default GDPChart;