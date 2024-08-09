import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

interface WeeklyChartProps {
    data: any;
}

export default function DailyContributionChart({ data }: WeeklyChartProps) {
    const [weekValues, setWeekValues] = useState([0, 0, 0, 0, 0, 0, 0]);
    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var weeks: any;
    const getContributionStats = (weeks: any) => {
        if (!data || !data.user) {
            return
        } else {
            weeks = data.user.contributionsCollection.contributionCalendar.weeks;
        }
        const newWeekValues = [0, 0, 0, 0, 0, 0, 0];
        weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                newWeekValues[day.weekday] += day.contributionCount;
            });
        });
        setWeekValues(newWeekValues);
    }

    useEffect(() => {
        getContributionStats(weeks);
    }, [data]);

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Daily Contributions</h3>
            <div className="h-64 rounded flex items-center justify-center">
                <BarChart
                    series={[
                        { data: weekValues },
                    ]}
                    height={290}
                    barLabel="value"
                    xAxis={[{ data: weekLabels, scaleType: 'band' }]}
                    margin={{ top: 20, bottom: 40, left: 40, right: 10 }}
                />
            </div>
        </div>
    );
}