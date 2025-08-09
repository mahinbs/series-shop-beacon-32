import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, Eye, Download, Filter } from 'lucide-react';

const ProfileOrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Dummy order data
  const orders = [
    {
      id: '#ORD-7829',
      date: '2025-06-10',
      items: [
        { name: 'Mystical Adventures Vol. 1', price: 19.99, quantity: 1 },
        { name: 'Dragon Tales Complete Series', price: 15.99, quantity: 2 }
      ],
      total: 51.97,
      status: 'Delivered',
      trackingNumber: 'TRK789012345',
      shippingAddress: '123 Main St, Anytown, ST 12345'
    },
    {
      id: '#ORD-7645',
      date: '2025-05-22',
      items: [
        { name: 'Fantasy Legends Collection', price: 19.99, quantity: 1 }
      ],
      total: 19.99,
      status: 'Delivered',
      trackingNumber: 'TRK456789012',
      shippingAddress: '123 Main St, Anytown, ST 12345'
    },
    {
      id: '#ORD-7432',
      date: '2025-05-08',
      items: [
        { name: 'Adventure Comics Set', price: 29.99, quantity: 1 },
        { name: 'Hero Chronicles Vol. 3', price: 16.99, quantity: 1 }
      ],
      total: 46.98,
      status: 'Shipped',
      trackingNumber: 'TRK234567890',
      shippingAddress: '123 Main St, Anytown, ST 12345'
    },
    {
      id: '#ORD-7201',
      date: '2025-04-15',
      items: [
        { name: 'Magic Realm Chronicles', price: 24.99, quantity: 1 }
      ],
      total: 24.99,
      status: 'Processing',
      trackingNumber: null,
      shippingAddress: '123 Main St, Anytown, ST 12345'
    },
    {
      id: '#ORD-6998',
      date: '2025-03-28',
      items: [
        { name: 'Warrior Tales Bundle', price: 39.99, quantity: 1 },
        { name: 'Mystic Powers Vol. 2', price: 18.99, quantity: 1 }
      ],
      total: 58.98,
      status: 'Cancelled',
      trackingNumber: null,
      shippingAddress: '123 Main St, Anytown, ST 12345'
    }
  ];

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
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
        case '365':
          matchesDate = daysAgo <= 365;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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
                  <TableCell className="font-medium text-white">{order.id}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm">
                          <div className="text-gray-300">{item.name}</div>
                          <div className="text-gray-500">Qty: {item.quantity} • ${item.price}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-white">${order.total}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
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

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileOrderHistory;