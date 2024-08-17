import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useEffect, useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { useTheme } from "../context/AppThemeProvider";

interface WeeklyChartProps {
    data: any;
    year: number;
}

export default function DailyContributionChart({ data, year }: WeeklyChartProps) {
    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [chartData, setChartData] = useState(() =>
        weekLabels.map(week => (
            { week: week, value: 0 }
        ))
    );
    var weeks: any;
    const getContributionStats = (weeks: any) => {
        if (!data || !data.user) {
            return
        } else {
            weeks = data.user.contributionsCollection.contributionCalendar.weeks;
        }

        const newWeekValues = weekLabels.map(week => (
            { week: week, value: 0 }
        ));

        weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                newWeekValues[day.weekday]['value'] += day.contributionCount;
            });
        });
        setChartData(newWeekValues);
    }

    useEffect(() => {
        getContributionStats(weeks);
    }, [data]);

    const chartConfig: ChartConfig = {
        week: {
            label: "Week",
            color: `${isDark ? "#f8fafc" : "#3b82f6"}`
        }
    };

    return (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 pb-6 rounded-lg shadow`}>
            <h3 className="text-lg font-semibold mb-4">{`Contributions by day (${year})`}</h3>
            <div className="h-64 rounded flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickCount={5}
                            tickFormatter={(value) => value + ""}
                        />
                        <ChartTooltip content={<ChartTooltipContent
                            color="var(--color-week)"
                            labelClassName={!isDark ? "text-white" : "text-black"}
                        />} />
                        <Bar
                            className="text-black"
                            label={true}
                            dataKey='value'
                            fill="var(--color-week)" color="#4ade80" radius={4} />
                    </BarChart>
                </ChartContainer>

                {/* <BarChart
                    series={[
                        { data: weekValues },
                    ]}
                    height={290}
                    barLabel="value"
                    xAxis={[{ data: weekLabels, scaleType: 'band' }]}
                    margin={{ top: 20, bottom: 40, left: 40, right: 10 }}
                /> */}
            </div>
        </div>
    );
}