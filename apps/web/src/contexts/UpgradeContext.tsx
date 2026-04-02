
import { createContext, useContext, useState, ReactNode } from "react";
import UpgradeModal, { UpgradeReason } from "@/components/upgrade/UpgradeModal";

interface UpgradeContextType {
    showUpgrade: (reason?: UpgradeReason) => void;
    hideUpgrade: () => void;
}

const UpgradeContext = createContext<UpgradeContextType | null>(null);

export const useUpgrade = () => {
    const context = useContext(UpgradeContext);
    if (!context) {
        throw new Error("useUpgrade must be used within an UpgradeProvider");
    }
    return context;
};

interface UpgradeProviderProps {
    children: ReactNode;
}

export const UpgradeProvider = ({ children }: UpgradeProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState<UpgradeReason>("general");

    const showUpgrade = (upgradeReason: UpgradeReason = "general") => {
        setReason(upgradeReason);
        setIsOpen(true);
    };

    const hideUpgrade = () => {
        setIsOpen(false);
    };

    return (
        <UpgradeContext.Provider value={{ showUpgrade, hideUpgrade }}>
            {children}
            <UpgradeModal open={isOpen} onClose={hideUpgrade} reason={reason} />
        </UpgradeContext.Provider>
    );
};
