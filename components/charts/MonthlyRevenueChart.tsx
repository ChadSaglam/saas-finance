"use client";

import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
  invoiced: number;
}

interface MonthlyRevenueChartProps {
  data: MonthlyData[];
}

const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ data }) => {
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
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            border: 'none',
            padding: '8px 12px',
          }}
        />
        <Bar 
          dataKey="invoiced" 
          name="Invoiced" 
          fill="#93C5FD" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="revenue" 
          name="Revenue" 
          fill="#3B82F6" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyRevenueChart;