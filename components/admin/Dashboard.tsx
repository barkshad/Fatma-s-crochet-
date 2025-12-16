import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onViewChange: (view: 'products' | 'content') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { products } = useProducts();

  const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
  const featuredCount = products.filter(p => p.isFeatured).length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'bg-blue-500', trend: '+12% this week' },
    { label: 'Inventory Value', value: `Ksh ${totalValue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', trend: '+5% this week' },
    { label: 'Featured Items', value: featuredCount, icon: Star, color: 'bg-yellow-500', trend: 'High visibility' },
    { label: 'Total Visits', value: '1.2k', icon: Users, color: 'bg-purple-500', trend: '+24% this week' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-brown font-serif">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back, here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
                 <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
               </div>
               <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mock Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">Weekly Engagement</h3>
             <select className="bg-gray-50 border-none text-sm rounded-lg p-2 outline-none">
               <option>Last 7 Days</option>
               <option>Last Month</option>
             </select>
           </div>
           
           {/* CSS Bar Chart */}
           <div className="h-64 flex items-end justify-between gap-2 px-2">
             {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
               <div key={i} className="w-full bg-gray-50 rounded-t-lg relative group">
                  <div 
                    style={{ height: `${h}%` }} 
                    className="absolute bottom-0 left-0 right-0 mx-auto w-4/5 bg-brand-sageDark opacity-80 group-hover:opacity-100 rounded-t-lg transition-all duration-500"
                  ></div>
                  <div className="absolute -bottom-6 w-full text-center text-xs text-gray-400">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="space-y-3">
             <button 
               onClick={() => onViewChange('products')}
               className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-brand-cream rounded-xl group transition-colors"
             >
               <div className="flex items-center gap-3">
                 <div className="bg-brand-sageDark text-white p-2 rounded-lg"><ShoppingBag size={18}/></div>
                 <span className="font-medium text-gray-700">Add New Product</span>
               </div>
               <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
             </button>
             
             <button 
               onClick={() => onViewChange('content')}
               className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-brand-cream rounded-xl group transition-colors"
             >
               <div className="flex items-center gap-3">
                 <div className="bg-brand-brown text-white p-2 rounded-lg"><TrendingUp size={18}/></div>
                 <span className="font-medium text-gray-700">Update Hero Banner</span>
               </div>
               <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
          
          <div className="mt-8 p-4 bg-brand-rose/20 rounded-xl">
             <h4 className="font-bold text-brand-brown mb-2 text-sm">Pro Tip</h4>
             <p className="text-xs text-brand-text/70">
               Keep your product descriptions detailed to improve SEO and help customers understand the materials used.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;