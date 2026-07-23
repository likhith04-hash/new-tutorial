'use client';

import React, { useEffect, useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  max: number;
}

interface WeeklyChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  title: string;
}

export default function WeeklyChart({
  data,
  height = 180,
  color = '#e5966b',
  title,
}: WeeklyChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map(d => d.max), 1);
  const chartHeight = height - 40; // reserve space for labels
  const barWidth = 40;
  const gap = 20;
  const totalWidth = data.length * barWidth + (data.length - 1) * gap;

  return (
    <div className="chart-container" style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px', fontWeight: 600 }}>{title}</div>
      <div style={{ position: 'relative', width: '100%', height: height, overflowX: 'auto', overflowY: 'visible' }}>
        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          style={{ width: '100%', minWidth: `${totalWidth}px`, height: '100%', display: 'block' }}
        >
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * chartHeight;
            const y = chartHeight - barHeight;
            const x = i * (barWidth + gap);
            
            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  className="chart-bar"
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  fill="#f4f5f7"
                  rx={4}
                />
                
                <rect
                  className="chart-bar-fill"
                  x={x}
                  y={mounted ? y : chartHeight}
                  width={barWidth}
                  height={mounted ? barHeight : 0}
                  fill={color}
                  rx={4}
                  style={{ 
                    transition: 'height 0.8s ease-out, y 0.8s ease-out, opacity 0.2s',
                    opacity: hoverIndex === i ? 0.8 : 1
                  }}
                />
                
                <text
                  className="chart-label"
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#888"
                >
                  {d.label}
                </text>

                {mounted && (
                  <text
                    className="chart-value"
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="bold"
                    fill={color}
                    opacity={mounted ? 1 : 0}
                    style={{ transition: 'opacity 0.8s ease-in' }}
                  >
                    {d.value}
                  </text>
                )}
                
                {hoverIndex === i && (
                  <g className="chart-tooltip">
                    <rect x={x + barWidth / 2 - 25} y={y - 35} width={50} height={24} fill="#333" rx={4} />
                    <text x={x + barWidth / 2} y={y - 18} fill="white" fontSize={10} textAnchor="middle">
                      {d.value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
