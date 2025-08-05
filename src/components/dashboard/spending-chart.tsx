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
  }[];
  config: ChartConfig;
}

export default function SpendingChart({ data, config }: SpendingChartProps) {
  return (
    <ChartContainer
      config={config}
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
              fill={`var(--color-${entry.category})`}
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
