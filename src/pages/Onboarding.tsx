
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const Onboarding = () => {
    const navigate = useNavigate();

    const handleComplete = () => {
        // Mark onboarding as complete in localStorage
        localStorage.setItem('onboardingComplete', 'true');
        // Navigate to dashboard
        navigate('/dashboard');
    };

    return <OnboardingWizard onComplete={handleComplete} />;
};

export default Onboarding;
