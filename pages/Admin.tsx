import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Plus, Loader2, CheckCircle, Trash2, Edit2, Save, LogOut, Layout, ShoppingBag, Database, Video, ChevronDown, ChevronUp, Image, FileText } from 'lucide-react';
import { Product, SiteContent } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useSiteContent } from '../hooks/useSiteContent';
import { PRODUCTS as DEMO_PRODUCTS } from '../constants';

const Admin: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // CMS State
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect Password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  // Check auth on load
  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-rose/20 w-full max-w-md">
          <h1 className="text-3xl font-serif font-bold text-brand-brown mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none"
                placeholder="Enter password..."
              />
            </div>
            <button type="submit" className="w-full bg-brand-brown text-white font-bold py-3 rounded-xl hover:bg-brand-sageDark transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen pb-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-brand-rose/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif font-bold text-brand-brown">CMS Dashboard</h1>
            <button onClick={handleLogout} className="text-brand-text/60 hover:text-red-500 flex items-center gap-2 font-bold text-sm bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="flex gap-6 mt-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 px-2 ${activeTab === 'products' ? 'border-brand-sageDark text-brand-sageDark' : 'border-transparent text-brand-text/60 hover:text-brand-brown'}`}
            >
              <ShoppingBag size={18} /> Manage Products
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 px-2 ${activeTab === 'content' ? 'border-brand-sageDark text-brand-sageDark' : 'border-transparent text-brand-text/60 hover:text-brand-brown'}`}
            >
              <Layout size={18} /> Edit Website Pages
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? <ProductManager /> : <ContentManager />}
      </div>
    </div>
  );
};

// --- Sub-Component: Product Manager ---
const ProductManager: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const initialFormState: Omit<Product, 'id'> = {
    name: '', category: 'Bags', price: 0, image: '', description: '', materials: '', care: '', isFeatured: false
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Check if we are currently using mock data
  const isMockData = products === DEMO_PRODUCTS;

  // Load product into form for editing
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setPreview(null);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (isMockData) {
      alert("Cannot delete demo data. Please initialize the database first.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm(`This will upload ${DEMO_PRODUCTS.length} demo products to your Firebase database. Duplicates may be created if data already exists. Continue?`)) return;
    setIsLoading(true);
    try {
      let count = 0;
      for (const p of DEMO_PRODUCTS) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = p; // Remove ID to let Firestore generate a new one
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp()
        });
        count++;
      }
      setSuccessMsg(`Successfully initialized database with ${count} products!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      console.error(e);
      alert("Failed to seed database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMockData && editingId) {
       alert("Cannot edit demo data directly. Please initialize the database first.");
       return;
    }
    setIsLoading(true);
    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = { ...formData, image: imageUrl, price: Number(formData.price) };

      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "products", editingId), payload);
        setSuccessMsg("Product updated!");
      } else {
        // Create new
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp()
        });
        setSuccessMsg("Product created!");
      }

      handleCancel(); // Reset form
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(error);
      alert("Error saving product");
    } finally {
      setIsLoading(false);
    }
  };

  const isVideoPreview = (url: string | null, file: File | null) => {
    if (file) {
      return file.type.startsWith('video/');
    }
    if (url) {
      return url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov)$/i);
    }
    return false;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-rose/20 sticky top-24">
          <h2 className="text-xl font-serif font-bold text-brand-brown mb-4 flex items-center gap-2">
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          {successMsg && (
            <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Media Upload */}
             <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 hover:border-brand-sageDark transition-colors">
                <label className="block text-xs font-bold text-brand-brown mb-2 uppercase tracking-wide">Product Media</label>
                <div className="relative">
                   {preview ? (
                     <div className="relative">
                       {isVideoPreview(preview, imageFile) ? (
                         <video src={preview} controls className="w-full h-48 object-cover rounded-lg mb-2 shadow-sm" />
                       ) : (
                         <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2 shadow-sm" />
                       )}
                       <button 
                         type="button" 
                         onClick={() => { setPreview(null); setImageFile(null); }}
                         className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   ) : (
                     <div className="h-32 flex flex-col items-center justify-center text-gray-400">
                        <Image size={32} />
                        <span className="text-xs mt-2">Click to upload image or video</span>
                     </div>
                   )}
                   <input 
                      type="file" 
                      accept="image/*,video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImageFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
              </div>

              <input 
                placeholder="Product Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30 transition-all focus:bg-white"
              />
              
              <div className="flex gap-2">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-1/2 px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
                >
                  <option value="Bags">Bags</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Baby">Baby</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Price (Ksh)" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                  className="w-1/2 px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
                />
              </div>

              <textarea 
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
              
              <input 
                placeholder="Materials"
                value={formData.materials}
                onChange={e => setFormData({...formData, materials: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />

              <input 
                placeholder="Care Instructions"
                value={formData.care}
                onChange={e => setFormData({...formData, care: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />

              <div className="flex items-center bg-brand-cream/30 p-2 rounded-lg border border-brand-rose/20">
                <input 
                  type="checkbox" 
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="mr-3 w-5 h-5 accent-brand-sageDark"
                />
                <label htmlFor="feat" className="text-sm font-medium text-brand-brown cursor-pointer">Show on Homepage as Featured</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-brand-sageDark text-white py-3 rounded-xl font-bold hover:bg-brand-brown transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18}/> : <Plus size={18} />)}
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-300">
                    Cancel
                  </button>
                )}
              </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-brand-rose/20">
             <span className="text-sm font-bold text-brand-text/60 uppercase">Total Items</span>
             <p className="text-2xl font-bold text-brand-brown">{products.length}</p>
           </div>
           
           <button 
              onClick={handleSeedDatabase}
              disabled={isLoading}
              className="bg-white border border-brand-rose text-brand-brown px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-rose/20 transition-colors"
           >
              {isLoading ? <Loader2 className="animate-spin" size={16}/> : <Database size={16}/>}
              Reset / Restore Demo Data
           </button>
        </div>
        
        {productsLoading ? (
           <div className="flex justify-center p-12 bg-white rounded-2xl shadow-sm"><Loader2 className="animate-spin text-brand-sageDark" size={32}/></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map(product => {
               const isVideo = product.image?.includes('/video/upload/') || product.image?.match(/\.(mp4|webm|mov)$/i);
               return (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-brand-rose/10 flex gap-4 hover:shadow-md transition-shadow group">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    {isVideo ? (
                      <video src={product.image} className="w-full h-full rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <img src={product.image} alt={product.name} className="w-full h-full rounded-lg object-cover bg-gray-100" />
                    )}
                    {product.isFeatured && (
                      <span className="absolute -top-2 -left-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">FEATURED</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-brand-brown text-lg truncate pr-4">{product.name}</h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium mb-1">{product.category}</span>
                      </div>
                      <p className="font-bold text-brand-sageDark whitespace-nowrap">Ksh {product.price.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-brand-text/60 truncate mt-1">{product.description}</p>
                    
                    <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Content Manager ---
const ContentManager: React.FC = () => {
  const { content: fetchedContent, loading } = useSiteContent();
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<{[key: string]: File | null}>({});
  const [previews, setPreviews] = useState<{[key: string]: string}>({});
  
  // Accordion state
  const [openSection, setOpenSection] = useState<string>('home');

  useEffect(() => {
    if (fetchedContent) {
      setFormData(fetchedContent);
    }
  }, [fetchedContent]);

  if (loading || !formData) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-sageDark" size={32} /></div>;

  const handleFileChange = (key: string, file: File) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleChange = (key: keyof SiteContent, value: string) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const updatedData = { ...formData };
      
      // Upload any changed images
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const url = await uploadToCloudinary(file as File);
          (updatedData as any)[key] = url;
        }
      }

      await setDoc(doc(db, 'site_content', 'main'), updatedData);
      alert('Website content updated successfully!');
      window.location.reload(); 
    } catch (e) {
      console.error(e);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-brand-rose/20">
        <div>
           <h2 className="text-xl font-serif font-bold text-brand-brown">Edit Website Content</h2>
           <p className="text-sm text-brand-text/60">Customize text, images, and contact info.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-sageDark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-brown transition-colors flex items-center gap-2 shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save All Changes
        </button>
      </div>

      {/* Accordion 1: Home Page */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-rose/20 overflow-hidden">
        <button onClick={() => toggleSection('home')} className="w-full flex justify-between items-center p-6 bg-gray-50 hover:bg-white transition-colors">
          <h3 className="text-lg font-bold text-brand-brown flex items-center gap-2"><Layout size={20}/> Home Page Content</h3>
          {openSection === 'home' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {openSection === 'home' && (
          <div className="p-6 space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-brand-brown mb-2">Main Title (Hero)</label>
                <textarea 
                  value={formData.heroTitle}
                  onChange={e => handleChange('heroTitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
                  rows={2}
                />
              </div>
               <div>
                <label className="block text-sm font-bold text-brand-brown mb-2">Subtitle</label>
                <textarea 
                  value={formData.heroSubtitle}
                  onChange={e => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-4 bg-brand-cream/50 rounded-xl border border-brand-rose/20">
               <h4 className="font-bold text-brand-brown mb-4 flex items-center gap-2"><Video size={18}/> Background Video</h4>
               <p className="text-xs text-brand-text/60 mb-4">Upload a video to play in the background of the main section. This replaces the default background.</p>
               <MediaUploader 
                  label="Hero Background Video" 
                  currentUrl={formData.heroBackgroundVideo} 
                  previewUrl={previews['heroBackgroundVideo']}
                  onChange={(f) => handleFileChange('heroBackgroundVideo', f)} 
                  accept="video/*"
                  type="video"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <MediaUploader 
                  label="Floating Image 1 (Left/Top)" 
                  currentUrl={formData.heroImage1} 
                  previewUrl={previews['heroImage1']}
                  onChange={(f) => handleFileChange('heroImage1', f)} 
               />
               <MediaUploader 
                  label="Floating Image 2 (Right/Bottom)" 
                  currentUrl={formData.heroImage2} 
                  previewUrl={previews['heroImage2']}
                  onChange={(f) => handleFileChange('heroImage2', f)} 
               />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: About Page */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-rose/20 overflow-hidden">
        <button onClick={() => toggleSection('about')} className="w-full flex justify-between items-center p-6 bg-gray-50 hover:bg-white transition-colors">
          <h3 className="text-lg font-bold text-brand-brown flex items-center gap-2"><FileText size={20}/> About Page Content</h3>
          {openSection === 'about' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {openSection === 'about' && (
          <div className="p-6 space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">About Section Title</label>
              <input 
                value={formData.aboutTitle}
                onChange={e => handleChange('aboutTitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-brand-brown mb-2">Paragraph 1</label>
                  <textarea 
                    value={formData.aboutText1}
                    onChange={e => handleChange('aboutText1', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 h-40 focus:bg-white outline-none"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-brand-brown mb-2">Paragraph 2</label>
                  <textarea 
                    value={formData.aboutText2}
                    onChange={e => handleChange('aboutText2', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 h-40 focus:bg-white outline-none"
                  />
               </div>
            </div>

             <MediaUploader 
                label="About Page Main Image" 
                currentUrl={formData.aboutImage} 
                previewUrl={previews['aboutImage']}
                onChange={(f) => handleFileChange('aboutImage', f)} 
             />
          </div>
        )}
      </div>

      {/* Accordion 3: Contact Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-rose/20 overflow-hidden">
        <button onClick={() => toggleSection('contact')} className="w-full flex justify-between items-center p-6 bg-gray-50 hover:bg-white transition-colors">
          <h3 className="text-lg font-bold text-brand-brown flex items-center gap-2"><Video size={20}/> Contact & Socials</h3>
          {openSection === 'contact' ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {openSection === 'contact' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">Email Address</label>
              <input 
                value={formData.contactEmail}
                onChange={e => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">Phone Text (Display)</label>
              <input 
                value={formData.contactPhone}
                onChange={e => handleChange('contactPhone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">WhatsApp Number (Digits only)</label>
              <input 
                value={formData.whatsappNumber}
                onChange={e => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-2">Instagram Link</label>
              <input 
                value={formData.instagramUrl}
                onChange={e => handleChange('instagramUrl', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-rose/30 bg-brand-cream/30 focus:bg-white outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaUploader: React.FC<{
  label: string, 
  currentUrl: string, 
  previewUrl?: string, 
  onChange: (f: File) => void,
  accept?: string,
  type?: 'image' | 'video'
}> = ({ label, currentUrl, previewUrl, onChange, accept = "image/*", type = 'image' }) => {
  
  const isVideo = type === 'video' || currentUrl?.includes('/video/') || currentUrl?.endsWith('.mp4');
  
  return (
    <div>
      <label className="block text-sm font-bold text-brand-brown mb-2">{label}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-3 rounded-xl border border-gray-200">
        <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative">
           {(previewUrl || currentUrl) ? (
             isVideo ? (
                <video src={previewUrl || currentUrl} className="w-full h-full object-cover" controls={false} muted />
             ) : (
                <img 
                  src={previewUrl || currentUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
             )
           ) : (
             <span className="text-gray-400 text-xs text-center px-2">No media</span>
           )}
           {isVideo && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white" size={24}/></div>}
        </div>
        
        <div className="flex-1 w-full">
           <input 
            type="file" 
            accept={accept}
            onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-sage file:text-brand-brown hover:file:bg-brand-sageDark hover:file:text-white cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-2">
            {type === 'video' ? 'Recommended: MP4, WebM (Max 20MB)' : 'Recommended: JPG, PNG (Max 5MB)'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;