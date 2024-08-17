import React, { useEffect, useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useTheme } from '../context/AppThemeProvider';

interface MonthlyContributionChartProps {
    data: any;
    year: number;
}

export default function MonthlyContributionChart({ data, year }: MonthlyContributionChartProps) {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const [chartData, setChartData] = useState(() =>
        monthLabels.map(label => ({ month: label, value: 0 }))
    );

    const chartConfig = {
        month: {
            color: `${isDark ? "#f8fafc" : "#3b82f6"}`
        }

    } satisfies ChartConfig

    const getMonthlyContributionStats = (contributionCalendar: any) => {
        const newMonthlyValues = monthLabels.map(label => ({ month: label, value: 0 }))

        if (!contributionCalendar) {
            return;
        }
        contributionCalendar.weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                const date = new Date(day.date);
                if (date.getFullYear() === year) {
                    const monthIndex = date.getMonth();
                    newMonthlyValues[monthIndex]['value'] += day.contributionCount;
                }
            });
        });

        setChartData(newMonthlyValues);
    };


    useEffect(() => {
        if (data?.user?.contributionsCollection?.contributionCalendar) {
            getMonthlyContributionStats(data.user.contributionsCollection.contributionCalendar);
        }
    }, [data, year]);

    return (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 pb-6 rounded-lg shadow`}>
            <h3 className="text-lg font-semibold mb-4">Monthly Contributions {year}</h3>
            <div className="h-64 rounded flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
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
                            className='text-white'
                            tickFormatter={(value) => value + ""}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent
                                color="var(--color-week)"
                                labelClassName={!isDark ? "text-white" : "text-black"}
                            />} />
                        <Bar
                            label={true}
                            dataKey='value' fill="var(--color-month)" radius={4} />
                    </BarChart>
                </ChartContainer>
                {/* <BarChart
                    series={[
                        { data: monthlyValues },
                    ]}
                    barLabel={'value'}
                    height={290}
                    xAxis={[{
                        data: monthLabels,
                        scaleType: 'band',
                        tickLabelStyle: {
                            angle: 45,
                            textAnchor: 'start',
                            fontSize: 12,
                        }
                    }]}
                    margin={{ top: 20, bottom: 40, left: 40, right: 10 }}
                /> */}
            </div>
        </div>
    );
}