import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Edit2, Trash2, X, Save, 
  Loader2, Image as ImageIcon, Video, CheckCircle, Database 
} from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { PRODUCTS as DEMO_PRODUCTS } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const ProductManager: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { addToast } = useToast();
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const initialFormState: Omit<Product, 'id'> = {
    name: '', category: 'Bags', price: 0, image: '', description: '', materials: '', care: '', isFeatured: false
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const openDrawer = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description,
        materials: product.materials,
        care: product.care,
        isFeatured: product.isFeatured || false
      });
      setPreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
      setPreview(null);
    }
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
        setEditingProduct(null);
        setFormData(initialFormState);
        setPreview(null);
        setImageFile(null);
    }, 300);
  };

  const handleDelete = async (id: string) => {
     if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await deleteDoc(doc(db, "products", id));
          addToast("Product deleted successfully", 'success');
        } catch(e) {
          addToast("Failed to delete product", 'error');
        }
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = { ...formData, image: imageUrl, price: Number(formData.price) };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), payload);
        addToast("Product updated successfully", 'success');
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp()
        });
        addToast("New product added successfully", 'success');
      }
      closeDrawer();
    } catch (error) {
      console.error(error);
      addToast("Error saving product", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isVideoPreview = (url: string | null, file: File | null) => {
    if (file) return file.type.startsWith('video/');
    if (url) return url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov)$/i);
    return false;
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm(`Initialize database with ${DEMO_PRODUCTS.length} demo products?`)) return;
    setIsLoading(true);
    try {
      for (const p of DEMO_PRODUCTS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = p;
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      addToast('Database seeded successfully', 'success');
    } catch (e) {
      console.error(e);
      addToast('Error seeding database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
           <div>
             <h2 className="text-2xl font-bold text-brand-brown font-serif">Product Inventory</h2>
             <p className="text-gray-500 text-sm">Manage your catalog, pricing, and stock.</p>
           </div>
           <div className="flex gap-2">
             <button onClick={handleSeedDatabase} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium text-sm transition-colors">
                <Database size={16} /> Seed Data
             </button>
             <button onClick={() => openDrawer()} className="bg-brand-sageDark text-white px-5 py-2 rounded-lg hover:bg-brand-brown transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
               <Plus size={18} /> Add Product
             </button>
           </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               placeholder="Search by name..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-sageDark outline-none transition-colors"
             />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
             <Filter size={18} className="text-gray-400 mr-2" />
             {['All', 'Bags', 'Sweaters', 'Baby', 'Accessories', 'Home'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategoryFilter(cat)}
                 className={`px-3 py-1.5 text-sm rounded-lg font-medium whitespace-nowrap transition-colors ${
                   categoryFilter === cat ? 'bg-brand-sage/20 text-brand-sageDark' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {productsLoading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-sageDark" /></div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredProducts.map(product => (
                     <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                             {product.image?.includes('/video/') ? <video src={product.image} className="w-full h-full object-cover"/> : <img src={product.image} alt="" className="w-full h-full object-cover"/>}
                           </div>
                           <span className="font-medium text-gray-800">{product.name}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                       <td className="px-6 py-4 text-sm font-bold text-gray-800">Ksh {product.price.toLocaleString()}</td>
                       <td className="px-6 py-4">
                         {product.isFeatured && (
                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                             <CheckCircle size={10} /> Featured
                           </span>
                         )}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openDrawer(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {filteredProducts.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No products found.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={closeDrawer}
               className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-serif font-bold text-xl text-brand-brown">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Media Upload */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-brand-sageDark transition-colors bg-gray-50 text-center relative group">
                  <input 
                      type="file" 
                      accept="image/*,video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImageFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {preview ? (
                     <div className="relative h-64 w-full rounded-lg overflow-hidden">
                       {isVideoPreview(preview, imageFile) ? (
                         <video src={preview} className="w-full h-full object-cover" controls/>
                       ) : (
                         <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                       )}
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium flex items-center gap-2"><Edit2 size={16}/> Change Media</span>
                       </div>
                     </div>
                  ) : (
                    <div className="py-8 text-gray-400">
                       <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                         <ImageIcon size={24} />
                       </div>
                       <p className="text-sm font-medium">Click to upload image or video</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                      >
                         {['Bags', 'Sweaters', 'Baby', 'Accessories', 'Home'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                      <input 
                        type="number"
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Materials</label>
                       <input 
                        value={formData.materials} 
                        onChange={e => setFormData({...formData, materials: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                       />
                    </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Care Info</label>
                       <input 
                        value={formData.care} 
                        onChange={e => setFormData({...formData, care: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
                       />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.isFeatured}
                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-5 h-5 accent-brand-sageDark"
                    />
                    <span className="font-medium text-gray-700">Mark as Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
                 <button 
                   onClick={handleSubmit} 
                   disabled={isLoading}
                   className="w-full bg-brand-brown text-white font-bold py-4 rounded-xl hover:bg-brand-sageDark transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                   {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                   {editingProduct ? 'Save Changes' : 'Create Product'}
                 </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductManager;