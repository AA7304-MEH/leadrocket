import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
    Mail,
    Plus,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Settings,
    Trash2,
    Play,
    Pause,
    RefreshCw,
    Shield,
    TrendingUp,
    Clock,
    Zap,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Sender {
    id: string;
    email: string;
    name: string;
    provider: 'gmail' | 'outlook' | 'smtp';
    status: 'active' | 'warming' | 'paused' | 'error';
    reputation: number;
    dailyLimit: number;
    sentToday: number;
    stats: {
        openRate: number;
        bounceRate: number;
        spamRate: number;
    };
    warmupDay?: number;
    lastActive: string;
}

const SenderManagement: React.FC = () => {
    const { toast } = useToast();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);

    const [senders, setSenders] = useState<Sender[]>([
        {
            id: '1',
            email: 'alex@leadrockets.com',
            name: 'Alex Thompson',
            provider: 'gmail',
            status: 'active',
            reputation: 92,
            dailyLimit: 500,
            sentToday: 245,
            stats: { openRate: 34.5, bounceRate: 1.2, spamRate: 0.1 },
            lastActive: '2 min ago'
        },
        {
            id: '2',
            email: 'sales@leadrockets.com',
            name: 'Sales Team',
            provider: 'outlook',
            status: 'warming',
            reputation: 78,
            dailyLimit: 100,
            sentToday: 50,
            stats: { openRate: 28.3, bounceRate: 2.1, spamRate: 0.3 },
            warmupDay: 5,
            lastActive: '1 hour ago'
        },
        {
            id: '3',
            email: 'outreach@leadrockets.com',
            name: 'Outreach',
            provider: 'smtp',
            status: 'paused',
            reputation: 65,
            dailyLimit: 200,
            sentToday: 0,
            stats: { openRate: 22.1, bounceRate: 4.5, spamRate: 0.8 },
            lastActive: '3 days ago'
        }
    ]);

    const getStatusColor = (status: Sender['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'warming': return 'bg-blue-100 text-blue-700';
            case 'paused': return 'bg-gray-100 text-gray-700';
            case 'error': return 'bg-red-100 text-red-700';
        }
    };

    const getReputationColor = (reputation: number) => {
        if (reputation >= 90) return 'text-green-600';
        if (reputation >= 70) return 'text-blue-600';
        if (reputation >= 50) return 'text-amber-600';
        return 'text-red-600';
    };

    const getProviderIcon = (provider: Sender['provider']) => {
        switch (provider) {
            case 'gmail': return (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
            );
            case 'outlook': return (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.232-.58.232h-8.547v-6.959l1.6-1.07 1.6 1.07V7.785L24 11.714V7.387zM14.4 20.4H0V3.6l14.4 2.4v14.4zm-7.2-6c-.8 0-1.44.24-1.92.72-.48.48-.72 1.12-.72 1.92s.24 1.44.72 1.92c.48.48 1.12.72 1.92.72s1.44-.24 1.92-.72c.48-.48.72-1.12.72-1.92s-.24-1.44-.72-1.92c-.48-.48-1.12-.72-1.92-.72z" />
                </svg>
            );
            case 'smtp': return <Settings className="w-5 h-5 text-gray-500" />;
        }
    };

    const toggleSenderStatus = (senderId: string) => {
        setSenders(senders.map(s => {
            if (s.id === senderId) {
                const newStatus = s.status === 'active' ? 'paused' : 'active';
                toast({
                    title: newStatus === 'active' ? 'Sender Activated' : 'Sender Paused',
                    description: s.email
                });
                return { ...s, status: newStatus };
            }
            return s;
        }));
    };

    const startWarmup = (senderId: string) => {
        setSenders(senders.map(s => {
            if (s.id === senderId) {
                toast({ title: 'Warmup Started 🔥', description: `Starting 14-day warmup for ${s.email}` });
                return { ...s, status: 'warming', warmupDay: 1, dailyLimit: 50 };
            }
            return s;
        }));
    };

    const removeSender = (senderId: string) => {
        const sender = senders.find(s => s.id === senderId);
        setSenders(senders.filter(s => s.id !== senderId));
        toast({ title: 'Sender Removed', description: sender?.email });
    };

    const handleConnect = async () => {
        if (!selectedProvider) return;

        setIsConnecting(true);

        // Simulate OAuth flow
        setTimeout(() => {
            const newSender: Sender = {
                id: Date.now().toString(),
                email: `new.sender@${selectedProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}`,
                name: 'New Sender',
                provider: selectedProvider as Sender['provider'],
                status: 'warming',
                reputation: 70,
                dailyLimit: 50,
                sentToday: 0,
                stats: { openRate: 0, bounceRate: 0, spamRate: 0 },
                warmupDay: 1,
                lastActive: 'Just now'
            };

            setSenders([...senders, newSender]);
            setIsConnecting(false);
            setShowAddDialog(false);
            setSelectedProvider('');
            toast({
                title: 'Account Connected! ✅',
                description: 'Starting 14-day warmup sequence'
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Sender Accounts</h2>
                    <p className="text-gray-500">Manage your email sending accounts</p>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Sender
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Connect Email Account</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedProvider('gmail')}
                                    className={`p-6 border-2 rounded-lg text-center transition-all ${selectedProvider === 'gmail'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                                    </svg>
                                    <p className="font-medium">Gmail / Workspace</p>
                                    <p className="text-xs text-gray-500 mt-1">OAuth connection</p>
                                </button>

                                <button
                                    onClick={() => setSelectedProvider('outlook')}
                                    className={`p-6 border-2 rounded-lg text-center transition-all ${selectedProvider === 'outlook'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24">
                                        <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.232-.58.232h-8.547v-6.959l1.6-1.07 1.6 1.07V7.785L24 11.714V7.387zM14.4 20.4H0V3.6l14.4 2.4v14.4z" />
                                    </svg>
                                    <p className="font-medium">Microsoft 365</p>
                                    <p className="text-xs text-gray-500 mt-1">Outlook connection</p>
                                </button>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <Settings className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">Custom SMTP</p>
                                <Badge variant="outline" className="mt-1">Advanced</Badge>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleConnect}
                                disabled={!selectedProvider || isConnecting}
                            >
                                {isConnecting ? 'Connecting...' : 'Connect Account'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Mail className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Senders</p>
                                <p className="text-2xl font-bold">{senders.filter(s => s.status === 'active').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sent Today</p>
                                <p className="text-2xl font-bold">{senders.reduce((acc, s) => acc + s.sentToday, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Shield className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Avg Reputation</p>
                                <p className="text-2xl font-bold">
                                    {Math.round(senders.reduce((acc, s) => acc + s.reputation, 0) / senders.length)}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Daily Capacity</p>
                                <p className="text-2xl font-bold">{senders.reduce((acc, s) => acc + s.dailyLimit, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sender List */}
            <div className="space-y-4">
                {senders.map((sender) => (
                    <Card key={sender.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                {/* Provider Icon & Info */}
                                <div className="flex items-center gap-4 min-w-[280px]">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        {getProviderIcon(sender.provider)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{sender.email}</span>
                                            <Badge className={getStatusColor(sender.status)}>
                                                {sender.status === 'warming'
                                                    ? `Warming (Day ${sender.warmupDay}/14)`
                                                    : sender.status
                                                }
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <span>{sender.name}</span>
                                            <span>•</span>
                                            <Clock className="w-3 h-3" />
                                            <span>{sender.lastActive}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Progress */}
                                <div className="flex-1 px-4">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-500">Daily Usage</span>
                                        <span className="font-medium">{sender.sentToday} / {sender.dailyLimit}</span>
                                    </div>
                                    <Progress
                                        value={(sender.sentToday / sender.dailyLimit) * 100}
                                        className="h-2"
                                    />
                                </div>

                                {/* Reputation */}
                                <div className="text-center px-4 border-l">
                                    <p className="text-sm text-gray-500">Reputation</p>
                                    <p className={`text-2xl font-bold ${getReputationColor(sender.reputation)}`}>
                                        {sender.reputation}%
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 px-4 border-l">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Open Rate</p>
                                        <p className="font-semibold text-green-600">{sender.stats.openRate}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Bounce</p>
                                        <p className="font-semibold text-amber-600">{sender.stats.bounceRate}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Spam</p>
                                        <p className="font-semibold text-red-600">{sender.stats.spamRate}%</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pl-4 border-l">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleSenderStatus(sender.id)}
                                    >
                                        {sender.status === 'active' ? (
                                            <><Pause className="w-4 h-4 mr-1" /> Pause</>
                                        ) : (
                                            <><Play className="w-4 h-4 mr-1" /> Resume</>
                                        )}
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {sender.status !== 'warming' && (
                                                <DropdownMenuItem onClick={() => startWarmup(sender.id)}>
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Start Warmup
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Test Connection
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => removeSender(sender.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Warmup Info */}
            {senders.some(s => s.status === 'warming') && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <RefreshCw className="w-8 h-8 text-blue-600" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900">Email Warmup in Progress</h4>
                                <p className="text-sm text-blue-700">
                                    Gradually increasing sending volume to build sender reputation.
                                    This takes 14 days for optimal deliverability.
                                </p>
                            </div>
                            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                View Schedule
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SenderManagement;
