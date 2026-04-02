
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User, Mail, Bell, Shield, CreditCard, Users, Link2, Trash2,
    Check, AlertTriangle, Plus, Crown
} from "lucide-react";
import { useUpgrade } from "@/contexts/UpgradeContext";
import { toast } from "sonner";

const Settings = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Inc",
        title: "Sales Manager",
    });
    const [notifications, setNotifications] = useState({
        emailReplies: true,
        emailOpens: false,
        weeklyReports: true,
        productUpdates: true,
    });
    const { showUpgrade } = useUpgrade();

    const handleSaveProfile = () => {
        toast.success("Profile saved successfully");
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your account and preferences.</p>
                </div>

                <Tabs defaultValue="profile">
                    <TabsList className="mb-6">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="w-4 h-4" /> Profile
                        </TabsTrigger>
                        <TabsTrigger value="email" className="gap-2">
                            <Mail className="w-4 h-4" /> Email
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="w-4 h-4" /> Notifications
                        </TabsTrigger>
                        <TabsTrigger value="team" className="gap-2">
                            <Users className="w-4 h-4" /> Team
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="gap-2">
                            <CreditCard className="w-4 h-4" /> Billing
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarFallback className="text-lg bg-primary text-white">
                                            {profile.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Change Photo</Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company</Label>
                                        <Input
                                            value={profile.company}
                                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Job Title</Label>
                                        <Input
                                            value={profile.title}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSaveProfile}>Save Changes</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Tab */}
                    <TabsContent value="email">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Accounts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">john@example.com</p>
                                                <p className="text-sm text-gray-500">Gmail • Connected</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                                    </div>
                                    <Button variant="outline" className="w-full gap-2">
                                        <Plus className="w-4 h-4" /> Connect Another Email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { key: 'emailReplies', label: 'Email Replies', desc: 'Get notified when someone replies' },
                                    { key: 'emailOpens', label: 'Email Opens', desc: 'Get notified when emails are opened' },
                                    { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly performance summary' },
                                    { key: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <Switch
                                            checked={notifications[item.key as keyof typeof notifications]}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, [item.key]: checked })
                                            }
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Team Tab */}
                    <TabsContent value="team">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Team Members</CardTitle>
                                <Button onClick={() => showUpgrade("team_members")} className="gap-2">
                                    <Plus className="w-4 h-4" /> Invite Member
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">John Doe</p>
                                                <p className="text-sm text-gray-500">john@example.com</p>
                                            </div>
                                        </div>
                                        <Badge>Owner</Badge>
                                    </div>
                                    <div className="text-center py-8 border rounded-lg border-dashed">
                                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 mb-2">Invite team members to collaborate</p>
                                        <Button variant="outline" onClick={() => showUpgrade("team_members")}>
                                            Upgrade to Pro
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Plan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className="bg-gray-200 text-gray-700">Free</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">78/100 emails used this month</p>
                                        </div>
                                        <Button onClick={() => showUpgrade("general")} className="gap-2">
                                            <Crown className="w-4 h-4" /> Upgrade
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <Button variant="destructive" className="gap-2">
                                        <Trash2 className="w-4 h-4" /> Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
