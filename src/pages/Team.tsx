import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
    Users,
    UserPlus,
    Mail,
    Crown,
    Shield,
    MoreVertical,
    Search,
    Lock,
    Check,
    X
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    status: 'active' | 'pending' | 'inactive';
    avatar?: string;
    lastActive: string;
}

const Team: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    // Check if user has team access (Scale plan)
    const hasTeamAccess = user?.subscription?.plan === 'scale' || user?.subscription?.plan === 'enterprise' || user?.role === 'admin';

    // Mock team members
    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: user?.name || 'You',
            email: user?.email || '',
            role: 'owner',
            status: 'active',
            lastActive: 'Now'
        },
        {
            id: '2',
            name: 'Sarah Chen',
            email: 'sarah@company.com',
            role: 'admin',
            status: 'active',
            lastActive: '2 hours ago'
        },
        {
            id: '3',
            name: 'Mike Rodriguez',
            email: 'mike@company.com',
            role: 'member',
            status: 'active',
            lastActive: '1 day ago'
        },
        {
            id: '4',
            name: 'Pending Invite',
            email: 'pending@company.com',
            role: 'member',
            status: 'pending',
            lastActive: 'Invited 3 days ago'
        }
    ];

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadge = (role: TeamMember['role']) => {
        switch (role) {
            case 'owner':
                return <Badge className="bg-purple-100 text-purple-700"><Crown className="w-3 h-3 mr-1" />Owner</Badge>;
            case 'admin':
                return <Badge className="bg-blue-100 text-blue-700"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
            default:
                return <Badge variant="outline">Member</Badge>;
        }
    };

    const getStatusBadge = (status: TeamMember['status']) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 mr-1" />Active</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700"><Mail className="w-3 h-3 mr-1" />Pending</Badge>;
            default:
                return <Badge variant="outline"><X className="w-3 h-3 mr-1" />Inactive</Badge>;
        }
    };

    const handleInvite = () => {
        if (!inviteEmail) {
            toast({ title: "Error", description: "Please enter an email address" });
            return;
        }
        toast({
            title: "Invitation Sent! 📧",
            description: `Invite sent to ${inviteEmail}`,
        });
        setInviteEmail('');
    };

    const handleRemoveMember = (member: TeamMember) => {
        toast({
            title: "Member Removed",
            description: `${member.name} has been removed from the team`,
        });
    };

    const handleChangeRole = (member: TeamMember, newRole: string) => {
        toast({
            title: "Role Updated",
            description: `${member.name} is now a ${newRole}`,
        });
    };

    // Show upgrade prompt if user doesn't have team access
    if (!hasTeamAccess) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md w-full text-center">
                        <CardHeader>
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-amber-600" />
                            </div>
                            <CardTitle>Team Collaboration</CardTitle>
                            <CardDescription>
                                Upgrade to Scale plan to unlock team features
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="text-left space-y-2">
                                {[
                                    'Invite unlimited team members',
                                    'Role-based permissions',
                                    'Shared campaigns & templates',
                                    'Team activity dashboard',
                                    'Approval workflows'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                onClick={() => navigate('/pricing')}
                            >
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade to Scale - $49/month
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                        <p className="text-gray-500">Manage your team members and permissions</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        {teamMembers.length} / 10 seats used
                    </Badge>
                </div>

                {/* Invite Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Invite Team Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Enter email address..."
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleInvite}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Send Invite
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Members List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Team Members
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                                {getInitials(member.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                {member.id === '1' && <Badge variant="outline" className="text-xs">You</Badge>}
                                            </div>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getRoleBadge(member.role)}
                                        {getStatusBadge(member.status)}
                                        <span className="text-xs text-gray-400 w-24">{member.lastActive}</span>
                                        {member.role !== 'owner' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleChangeRole(member, 'admin')}>
                                                        Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleChangeRole(member, 'member')}>
                                                        Make Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleRemoveMember(member)}
                                                    >
                                                        Remove from Team
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Team;
