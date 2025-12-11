
import { Check, X } from "lucide-react";

const features = [
    { name: "AI Personalization", leadrockets: true, lemlist: false, smartlead: true, mailshake: false },
    { name: "Built-in Email Verifier", leadrockets: true, lemlist: false, smartlead: false, mailshake: false },
    { name: "Unlimited Sender Accounts", leadrockets: true, lemlist: false, smartlead: true, mailshake: false },
    { name: "One-Click Campaign Cloning", leadrockets: true, lemlist: true, smartlead: false, mailshake: true },
    { name: "Reply Intelligence", leadrockets: true, lemlist: false, smartlead: false, mailshake: false },
    { name: "Price (Starter)", leadrockets: "$19/mo", lemlist: "$59/mo", smartlead: "$29/mo", mailshake: "$58/mo", isText: true },
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
                        See how we stack up against the "big guys".
                    </p>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Feature</th>
                                <th scope="col" className="px-6 py-3 text-primary font-bold text-base">LeadRockets</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Lemlist</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Smartlead</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Mailshake</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {feature.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {feature.isText ? (
                                            <span className="font-bold text-primary">{feature.leadrockets}</span>
                                        ) : (
                                            feature.leadrockets ? <Check className="w-6 h-6 text-success mx-auto sm:mx-0" /> : <X className="w-6 h-6 text-gray-300 mx-auto sm:mx-0" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        {feature.isText ? feature.lemlist : (feature.lemlist ? <Check className="w-6 h-6 text-gray-400" /> : <X className="w-6 h-6 text-red-300" />)}
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        {feature.isText ? feature.smartlead : (feature.smartlead ? <Check className="w-6 h-6 text-gray-400" /> : <X className="w-6 h-6 text-red-300" />)}
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        {feature.isText ? feature.mailshake : (feature.mailshake ? <Check className="w-6 h-6 text-gray-400" /> : <X className="w-6 h-6 text-red-300" />)}
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
