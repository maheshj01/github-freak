import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface MonthlyContributionChartProps {
    data: any;
    year: number;
}

export default function MonthlyContributionChart({ data, year }: MonthlyContributionChartProps) {
    const [monthlyValues, setMonthlyValues] = useState<number[]>(new Array(12).fill(0));
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getMonthlyContributionStats = (contributionCalendar: any) => {
        const newMonthlyValues = new Array(12).fill(0);

        contributionCalendar.weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                const date = new Date(day.date);
                if (date.getFullYear() === year) {
                    const monthIndex = date.getMonth();
                    newMonthlyValues[monthIndex] += day.contributionCount;
                }
            });
        });

        setMonthlyValues(newMonthlyValues);
    };

    useEffect(() => {
        if (data?.user?.contributionsCollection?.contributionCalendar) {
            getMonthlyContributionStats(data.user.contributionsCollection.contributionCalendar);
        }
    }, [data, year]);

    if (!data?.user?.contributionsCollection?.contributionCalendar) {
        return <div>No data available</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Monthly Contributions {year}</h3>
            <div className="h-64 rounded flex items-center justify-center">
                <BarChart
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
                    margin={{ top: 20, bottom: 70, left: 40, right: 10 }}
                />
            </div>
        </div>
    );
}