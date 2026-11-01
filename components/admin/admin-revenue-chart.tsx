"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsTrendPoint } from "@/app/data/admin/get-admin-analytics";
import { formatETB } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Gross Revenue (ETB)",
    color: "var(--color-primary, #10b981)",
  },
  enrollments: {
    label: "New Enrollments",
    color: "var(--color-chart-2, #3b82f6)",
  },
} satisfies ChartConfig;

interface AdminRevenueChartProps {
  data: AnalyticsTrendPoint[];
}

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  const [metric, setMetric] = React.useState<"revenue" | "enrollments">("revenue");
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "all">("30d");

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeRange === "7d") return data.slice(-7);
    if (timeRange === "30d") return data.slice(-30);
    return data;
  }, [data, timeRange]);

  const totalRevenue = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [filteredData]);

  const totalEnrollments = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.enrollments, 0);
  }, [filteredData]);

  return (
    <Card className="@container/chart">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Platform Revenue & Enrollment Activity
          </CardTitle>
          <CardDescription>
            {metric === "revenue"
              ? `Total ${formatETB(totalRevenue)} generated in selected period`
              : `${totalEnrollments} student enrollment${totalEnrollments === 1 ? "" : "s"} in selected period`}
          </CardDescription>
        </div>

        <CardAction className="flex flex-wrap items-center gap-2">
          <Select
            value={metric}
            onValueChange={(val) => setMetric(val as "revenue" | "enrollments")}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="revenue">Revenue (ETB)</SelectItem>
              <SelectItem value="enrollments">Enrollments</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as "7d" | "30d" | "all")}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">Full Period</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={filteredData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillEnrollments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value) =>
                metric === "revenue" ? `${value}` : `${value}`
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {metric === "revenue" ? (
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue"
              />
            ) : (
              <Area
                dataKey="enrollments"
                type="natural"
                fill="url(#fillEnrollments)"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Enrollments"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
