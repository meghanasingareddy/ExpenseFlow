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
    fill: string;
  }[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.category] = { label: item.category };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[280px]"
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
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={entry.fill}
              className="outline-none ring-0 focus:outline-none"
            />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  );
}
