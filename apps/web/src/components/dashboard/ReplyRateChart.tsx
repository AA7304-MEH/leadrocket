
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "Mon", rate: 2 },
    { day: "Tue", rate: 5 },
    { day: "Wed", rate: 8 },
    { day: "Thu", rate: 12 },
    { day: "Fri", rate: 10 },
    { day: "Sat", rate: 11 },
    { day: "Sun", rate: 15 },
];

const ReplyRateChart = () => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Reply Rate Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="day"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#4dabf7" // primary
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ReplyRateChart;
