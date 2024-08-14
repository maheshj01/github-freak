import React, { useEffect, useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface MonthlyContributionChartProps {
    data: any;
    year: number;
}

export default function MonthlyContributionChart({ data, year }: MonthlyContributionChartProps) {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [chartData, setChartData] = useState(() =>
        monthLabels.map(label => ({ month: label, value: 0 }))
    );

    const chartConfig = {
        "month": {
            color: "#4a81f0",
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
        <div className="bg-white p-4 pb-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-black">Monthly Contributions {year}</h3>
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
                            tickFormatter={(value) => value + ""}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
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