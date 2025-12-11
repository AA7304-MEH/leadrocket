
interface HealthScoreProps {
    score: number;
}

const HealthScore = ({ score }: HealthScoreProps) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = "text-red-500";
    if (score >= 80) color = "text-green-500";
    else if (score >= 50) color = "text-yellow-500";

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-4">Health Score</h3>
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-1000 ease-out ${color}`}
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                    {score}
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">Target: 90+</p>
        </div>
    );
};

export default HealthScore;
