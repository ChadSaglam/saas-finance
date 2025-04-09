"use client";

import React, { memo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
  invoiced: number;
}

interface MonthlyRevenueChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}: </span>
            ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MonthlyRevenueChart = memo<MonthlyRevenueChartProps>(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="invoiced" 
          name="Invoiced" 
          fill="#93C5FD" 
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
          animationBegin={200}
        />
        <Bar 
          dataKey="revenue" 
          name="Revenue" 
          fill="#3B82F6" 
          radius={[4, 4, 0, 0]} 
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

MonthlyRevenueChart.displayName = 'MonthlyRevenueChart';

export default MonthlyRevenueChart;