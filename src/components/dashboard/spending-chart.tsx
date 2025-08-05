"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface SpendingChartProps {
  data: {
    category: string;
    value: number;
    label: string;
  }[];
  config: ChartConfig;
}

export default function SpendingChart({ data, config }: SpendingChartProps) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-full w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius="30%"
          strokeWidth={2}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-medium fill-primary-foreground"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={`var(--color-${entry.category})`}
              className="outline-none ring-0 focus:outline-none"
            />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="label" />}
          className="!top-0 -mt-2 flex-wrap justify-center gap-x-4 gap-y-2"
        />
      </PieChart>
    </ChartContainer>
  );
}
