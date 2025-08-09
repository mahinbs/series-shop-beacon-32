import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, Eye, Download, Filter, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AuthService } from '@/services/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ProfileOrderHistory = () => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userOrders = await AuthService.getOrders(user.id);
        
        // Fetch order details for each order
        const ordersWithDetails = await Promise.all(
          userOrders.map(async (order) => {
            try {
              const details = await AuthService.getOrderDetails(order.id, user.id);
              return {
                ...order,
                items: details.items,
                date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
                status: order.status || 'Processing',
                trackingNumber: null, // This would need to be added to the orders table if needed
                shippingAddress: 'Address from order data' // This would need to be added to the orders table if needed
              };
            } catch (error) {
              console.error('Error fetching order details:', error);
              return {
                ...order,
                items: [],
                date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
                status: order.status || 'Processing',
                trackingNumber: null,
                shippingAddress: 'Address from order data'
              };
            }
          })
        );
        
        setOrders(ordersWithDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'shipped':
        return 'bg-blue-600 text-white';
      case 'processing':
        return 'bg-yellow-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some((item: any) => item.product_title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter !== 'all' && order.date) {
      const orderDate = new Date(order.date);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
      
      switch (dateFilter) {
        case '30':
          matchesDate = daysAgo <= 30;
          break;
        case '90':
          matchesDate = daysAgo <= 90;
          break;
        case '180':
          matchesDate = daysAgo <= 180;
          break;
        case '365':
          matchesDate = daysAgo <= 365;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>
        <div className="text-center py-8">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to view your order history.</p>
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found.</p>
          {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters.</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Start shopping to see your orders here!</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Order History
          </h2>
          <p className="text-gray-400 mt-1">Track and manage your orders</p>
        </div>
        <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm">{filteredOrders.length} orders found</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-300 font-semibold">Order ID</TableHead>
                <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                <TableHead className="text-gray-300 font-semibold">Items</TableHead>
                <TableHead className="text-gray-300 font-semibold">Total</TableHead>
                <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-800/30">
                  <TableCell className="font-medium text-white">{order.order_number}</TableCell>
                  <TableCell className="text-gray-300">
                    {order.date ? new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="text-sm">
                          <div className="text-gray-300">{item.product_title}</div>
                          <div className="text-gray-500">Qty: {item.quantity} • ${item.price}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-white">${order.total}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.trackingNumber && (
                        <Button size="sm" variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
                          Track
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOrderHistory;