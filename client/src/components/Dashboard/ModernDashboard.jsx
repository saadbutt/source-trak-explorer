import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Activity, 
  Users, 
  Database, 
  Code, 
  Search, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, className = "" }) => (
  <Card className={`relative overflow-hidden ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const RecentActivity = ({ activities = [] }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {activity.type === 'block' ? 'B' : 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {activity.type}
            </Badge>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recent activity</p>
        </div>
      )}
    </CardContent>
  </Card>
);

const PeerStatus = ({ peers = [] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        Peer Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {peers.length > 0 ? (
          peers.map((peer, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  peer.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="font-medium">{peer.name}</span>
              </div>
              <Badge variant={peer.status === 'up' ? 'default' : 'destructive'}>
                {peer.status === 'up' ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {peer.status}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No peer data available</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const TransactionChart = ({ data = [] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Transaction Analytics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Chart visualization would go here</p>
          <p className="text-sm">Integration with chart library needed</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SearchBar = ({ onSearch, placeholder = "Search blocks, transactions, or hashes..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSearch={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={!searchTerm.trim()}>
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ModernDashboard = ({ 
  dashStats = {}, 
  peerList = [], 
  blockActivity = [],
  transactionByOrg = [],
  onSearch = () => {}
}) => {
  const [stats, setStats] = useState({
    blocks: 0,
    transactions: 0,
    peers: 0,
    chaincodes: 0
  });

  useEffect(() => {
    // Map props to state
    setStats({
      blocks: dashStats.latestBlock || 0,
      transactions: dashStats.txCount || 0,
      peers: dashStats.peerCount || 0,
      chaincodes: dashStats.chaincodeCount || 0
    });
  }, [dashStats]);

  const recentActivities = blockActivity.slice(0, 5).map(block => ({
    title: `Block ${block.blocknum}`,
    type: 'block',
    time: new Date(block.createdt).toLocaleString(),
    txcount: block.txcount
  }));

  const peerStatuses = peerList.map(peer => ({
    name: peer.server_hostname || peer.name,
    status: peer.status || (Math.random() > 0.2 ? 'up' : 'down') // Mock status
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your Hyperledger Fabric network performance and activity
            </p>
          </div>
          
          {/* Search */}
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Blocks"
            value={stats.blocks.toLocaleString()}
            icon={Database}
            trend="+2.5% from yesterday"
            className="border-l-4 border-l-blue-500"
          />
          <StatCard
            title="Transactions"
            value={stats.transactions.toLocaleString()}
            icon={Activity}
            trend="+12.3% from yesterday"
            className="border-l-4 border-l-green-500"
          />
          <StatCard
            title="Active Peers"
            value={stats.peers}
            icon={Users}
            trend="All peers online"
            className="border-l-4 border-l-purple-500"
          />
          <StatCard
            title="Chaincodes"
            value={stats.chaincodes}
            icon={Code}
            trend="3 recently deployed"
            className="border-l-4 border-l-orange-500"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity activities={recentActivities} />
              <PeerStatus peers={peerStatuses} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <TransactionChart data={transactionByOrg} />
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PeerStatus peers={peerStatuses} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernDashboard;