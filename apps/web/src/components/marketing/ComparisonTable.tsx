
import { Check, X } from "lucide-react";

const features = [
    { name: "AI Personalization", leadrockets: true, others: false },
    { name: "Built-in Email Verifier", leadrockets: true, others: false },
    { name: "Unlimited Sender Accounts", leadrockets: true, others: true },
    { name: "One-Click Campaign Cloning", leadrockets: true, others: false },
    { name: "Reply Intelligence", leadrockets: true, others: false },
    { name: "Founder-Friendly Setup", leadrockets: true, others: false },
    { name: "Price (Starter)", leadrockets: "$19/mo", others: "$50+/mo", isText: true },
];

const ComparisonTable = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why LeadRockets Wins
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Stop overpaying for tools built for enterprise sales teams.
                    </p>
                </div>

                <div className="relative overflow-hidden shadow-xl sm:rounded-2xl border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-base font-semibold">Feature</th>
                                <th scope="col" className="px-6 py-4 text-center bg-primary/5 border-t-4 border-primary">
                                    <span className="text-primary font-bold text-lg">LeadRockets</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-base font-medium text-gray-500">
                                    The Big Guys
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50 last:border-b-0">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-base">
                                        {feature.name}
                                    </th>
                                    <td className="px-6 py-4 text-center bg-primary/5">
                                        {feature.isText ? (
                                            <span className="font-bold text-primary text-lg">{feature.leadrockets}</span>
                                        ) : (
                                            feature.leadrockets ?
                                                <div className="flex justify-center"><Check className="w-8 h-8 text-green-500 p-1 bg-green-100 rounded-full" /></div> :
                                                <X className="w-6 h-6 text-gray-300 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {feature.isText ? (
                                            <span className="font-medium text-gray-500 text-lg">{feature.others}</span>
                                        ) : (
                                            feature.others ?
                                                <div className="flex justify-center"><Check className="w-6 h-6 text-gray-400" /></div> :
                                                <div className="flex justify-center"><X className="w-6 h-6 text-red-300" /></div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTable;
