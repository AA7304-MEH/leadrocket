import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  TrendingUp,
  Target,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Lead {
  _id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  source: string;
  createdAt: string;
  metadata?: {
    confidence?: number;
  };
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  monthlyUsage: number;
  monthlyLimit: number;
}

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        // Fetch recent leads
        const leadsResponse = await fetch(`${API_URL}/leads?limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (leadsResponse.ok) {
          const data = await leadsResponse.json();
          setLeads(data.data);
        }

        // Fetch dashboard stats
        const statsResponse = await fetch(`${API_URL}/lead-generation/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user && token) {
      fetchStats();
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token) {
      setIsLoading(false);
    }
  }, [user, token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'contacted': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'qualified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'converted': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'rejected': return <Trash2 className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/leads')}>
                <Eye className="h-4 w-4 mr-2" />
                View All Leads
              </Button>
              <Button onClick={() => navigate('/profile')}>
                <Users className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All time leads generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.newLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting first contact
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.qualifiedLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.convertedLeads || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully converted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Monthly Usage
            </CardTitle>
            <CardDescription>
              Your lead generation usage for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Leads Generated</span>
                <span>{stats?.monthlyUsage || 0} / {stats?.monthlyLimit || 50}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 50)) * 100}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.monthlyLimit && stats.monthlyLimit - (stats?.monthlyUsage || 0) > 0
                  ? `${stats.monthlyLimit - (stats?.monthlyUsage || 0)} leads remaining this month`
                  : 'Monthly limit reached'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                Your latest generated leads
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/leads')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start generating leads to see them here
                </p>
                <Button onClick={() => navigate('/leads')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Your First Lead
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{lead.companyName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(lead.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(lead.status)}
                              <span className="capitalize">{lead.status}</span>
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(lead.priority)}>
                            {lead.priority}
                          </Badge>
                        </div>
                      </div>
                      {lead.contactName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Contact: {lead.contactName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Generated {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;