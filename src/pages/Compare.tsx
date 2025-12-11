
import ComparisonTable from "@/components/marketing/ComparisonTable";
import FinalCTA from "@/components/marketing/FinalCTA";

const Compare = () => {
    return (
        <div className="bg-white">
            <div className="pt-24 pb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Compare LeadRockets
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    See why we're better than the rest.
                </p>
            </div>
            <ComparisonTable />
            <FinalCTA />
        </div>
    )
}

export default Compare
