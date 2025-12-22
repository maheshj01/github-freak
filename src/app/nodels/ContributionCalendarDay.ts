
class ContributionCalendarDay {
    color: string;
    date: string;
    count: number;
    weekDay: number;

    constructor(color: string, date: string, count: number, weekDay: number) {
        this.color = color;
        this.date = date;
        this.count = count;
        this.weekDay = weekDay;
    }
}

export default ContributionCalendarDay;