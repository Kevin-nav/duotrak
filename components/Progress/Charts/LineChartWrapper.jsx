'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const LineChartWrapper = ({ data, xAxisKey, lines, aspect = 2 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-secondary-text-medium p-4">No data available for this chart.</div>;
  }

  return (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="hsl(var(--secondary-text-medium))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="hsl(var(--secondary-text-medium))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`}
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
        />
        <Legend 
          iconType="circle" 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
          formatter={(value, entry) => {
            const { color } = entry;
            return <span style={{ color }}>{value}</span>;
          }}
        />
        {lines && lines.map((line) => (
          <Line 
            key={line.dataKey} 
            type="monotone" 
            dataKey={line.dataKey} 
            name={line.name} 
            stroke={line.color} 
            strokeWidth={2.5}
            dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            connectNulls={true}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}; 