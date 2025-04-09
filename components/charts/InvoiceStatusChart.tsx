"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface InvoiceStatusChartProps {
  data: StatusData[];
}

const InvoiceStatusChart: React.FC<InvoiceStatusChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string) => [`${value} invoices`, name]}
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            border: 'none',
            padding: '8px 12px',
          }}
        />
        <Legend verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InvoiceStatusChart;