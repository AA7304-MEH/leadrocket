
import { useState } from "react";
import PathSelection from "@/components/onboarding/PathSelection";
import GuidedSetup from "@/components/onboarding/GuidedSetup";

const Onboarding = () => {
    const [pathSelected, setPathSelected] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-12 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" // Replace with Logo
                    alt="LeadRockets"
                />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full">
                {!pathSelected ? (
                    <PathSelection onSelect={() => setPathSelected(true)} />
                ) : (
                    <GuidedSetup />
                )}
            </div>
        </div>
    )
}

export default Onboarding
