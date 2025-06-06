'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const BarChartWrapper = ({ data, xAxisKey, yAxisKey, bars, layout = 'horizontal', aspect = 2 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-secondary-text-medium p-4">No data available for this chart.</div>;
  }
  
  // Determine keys for XAxis and YAxis based on layout
  const currentXAxisKey = layout === 'horizontal' ? xAxisKey : yAxisKey;
  const currentYAxisKey = layout === 'horizontal' ? yAxisKey : xAxisKey;
  const xAxisType = layout === 'horizontal' ? 'category' : 'number';
  const yAxisType = layout === 'horizontal' ? 'number' : 'category';

  return (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <BarChart 
        data={data} 
        layout={layout} 
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        barGap={layout === 'horizontal' ? 4 : 2} // Adjust gap based on layout
        barCategoryGap={layout === 'horizontal' ? '20%' : '10%'}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
        <XAxis 
          dataKey={currentXAxisKey}
          type={xAxisType}
          stroke="hsl(var(--secondary-text-medium))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          dataKey={currentYAxisKey} 
          type={yAxisType}
          stroke="hsl(var(--secondary-text-medium))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => typeof value === 'number' ? `${value}` : value}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: 'hsl(var(--primary-text-dark))'
          }}
          labelStyle={{ color: 'hsl(var(--primary-text-dark))' }}
          itemStyle={{ color: 'hsl(var(--secondary-text-medium))' }}
          cursor={{ fill: 'hsl(var(--accent))' , opacity: 0.2 }}
        />
        <Legend 
          iconType="square" 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
          formatter={(value, entry) => {
            const { color } = entry;
            return <span style={{ color }}>{value}</span>;
          }}
        />
        {bars && bars.map((bar, index) => (
          <Bar 
            key={bar.dataKey} 
            dataKey={bar.dataKey} 
            name={bar.name} 
            fill={bar.color} 
            radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]} // Rounded corners based on layout
            // barSize={20} // Example: fixed bar size
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}; 