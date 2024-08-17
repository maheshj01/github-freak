"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './card';

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "./chart";

import { useTheme } from "../context/AppThemeProvider";

export default function GHAreaChart({ data, year }: { data: any, year: number }) {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [chartData, setChartData] = React.useState<any[]>([]);

    const chartConfig = {
        week: {
            color: `${isDark ? "#f8fafc" : "#3b82f6"}`
        },
    } satisfies ChartConfig

    const buildChartData = (contributionCalendar: any) => {
        const dataValues: any[] = [];

        if (!contributionCalendar) {
            return;
        }

        contributionCalendar.weeks.forEach((week: any, index: number) => {
            const totalContributions = week.contributionDays.reduce((sum: number, day: any) => sum + day.contributionCount, 0);
            const startOfWeek = new Date(week.contributionDays[0]?.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            dataValues.push({
                week: `Week ${index + 1} (${startOfWeek})`,
                totalContributions,
            });
        });

        setChartData(dataValues);
    };

    React.useEffect(() => {
        if (data?.user?.contributionsCollection?.contributionCalendar) {
            buildChartData(data.user.contributionsCollection.contributionCalendar);
        }
    }, [data, year]);

    return (
        <Card className={`${isDark ? ' bg-gray-800 text-white' : 'text-black bg-slate-50'} rounded-lg`}>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Area Chart - Weekly Contributions</CardTitle>
                    <CardDescription>
                        Showing total contributions for each week of the year
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillWeek" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="25%"
                                    stopColor="var(--color-week)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-week)"
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <ChartTooltip
                            cursor={false}
                            labelClassName={!isDark ? "text-white" : "text-black"}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => value}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="totalContributions"
                            type="natural"
                            fill={isDark ? "#ffffff" : "#3b82f6"}
                            stroke={isDark ? "#ffffff" : "#3b82f6"}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
