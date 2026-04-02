import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SenderManagement from '@/components/email/SenderManagement';
import DeliverabilityMonitor from '@/components/email/DeliverabilityMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Shield, Settings } from 'lucide-react';

const EmailInfrastructure: React.FC = () => {
    const [activeTab, setActiveTab] = useState('senders');

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Email Infrastructure</h1>
                <p className="text-gray-500">Manage senders, deliverability, and email settings</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="senders" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Sender Accounts
                    </TabsTrigger>
                    <TabsTrigger value="deliverability" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Deliverability
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="senders" className="mt-6">
                    <SenderManagement />
                </TabsContent>

                <TabsContent value="deliverability" className="mt-6">
                    <DeliverabilityMonitor />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <div className="grid gap-6">
                        {/* Sending Settings */}
                        <div className="p-6 bg-white border rounded-lg">
                            <h3 className="font-semibold mb-4">Sending Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Daily Send Limit</p>
                                        <p className="text-sm text-gray-500">Maximum emails per day across all senders</p>
                                    </div>
                                    <span className="font-bold text-lg">800</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Send Interval</p>
                                        <p className="text-sm text-gray-500">Time between each email</p>
                                    </div>
                                    <span className="font-bold">30-90 seconds</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Sending Hours</p>
                                        <p className="text-sm text-gray-500">Only send during business hours</p>
                                    </div>
                                    <span className="font-bold">9 AM - 5 PM</span>
                                </div>
                            </div>
                        </div>

                        {/* Domain Settings */}
                        <div className="p-6 bg-white border rounded-lg">
                            <h3 className="font-semibold mb-4">Domain Authentication</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div>
                                            <p className="font-medium">SPF Record</p>
                                            <p className="text-sm text-gray-500">Configured correctly</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-medium">Valid ✓</span>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div>
                                            <p className="font-medium">DKIM Signature</p>
                                            <p className="text-sm text-gray-500">DomainKeys Identified Mail</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-medium">Valid ✓</span>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div>
                                            <p className="font-medium">DMARC Policy</p>
                                            <p className="text-sm text-gray-500">Domain-based Message Authentication</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-medium">Valid ✓</span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Settings */}
                        <div className="p-6 bg-white border rounded-lg">
                            <h3 className="font-semibold mb-4">Tracking & Analytics</h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium">Track Email Opens</p>
                                        <p className="text-sm text-gray-500">Use tracking pixel for open detection</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary" />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium">Track Link Clicks</p>
                                        <p className="text-sm text-gray-500">Redirect links through tracking domain</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary" />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium">Custom Tracking Domain</p>
                                        <p className="text-sm text-gray-500">Use your own domain for tracking links</p>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary" />
                                </label>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
};

export default EmailInfrastructure;
