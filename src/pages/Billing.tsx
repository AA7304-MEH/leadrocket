import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BillingManager from '@/components/billing/BillingManager';
import CreditPurchase from '@/components/billing/CreditPurchase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Sparkles, Receipt } from 'lucide-react';

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState('subscription');
    const [credits, setCredits] = useState(150);

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
                <p className="text-gray-500">Manage your plan, credits, and payment methods</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="subscription" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Subscription
                    </TabsTrigger>
                    <TabsTrigger value="credits" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Credits
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="subscription" className="mt-6">
                    <BillingManager />
                </TabsContent>

                <TabsContent value="credits" className="mt-6">
                    <CreditPurchase
                        currentCredits={credits}
                        onPurchase={(newCredits) => setCredits(credits + newCredits)}
                    />
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
};

export default Billing;
