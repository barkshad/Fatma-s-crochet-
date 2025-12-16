import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { generateProductDetailsFromImage } from '../utils/aiHelper';
import { Plus, Loader2, Image as ImageIcon, CheckCircle, Trash2, Edit2, Save, LogOut, Layout, ShoppingBag, Sparkles, Database } from 'lucide-react';
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
      <div className="bg-white border-b border-brand-rose/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif font-bold text-brand-brown">CMS Dashboard</h1>
            <button onClick={handleLogout} className="text-brand-text/60 hover:text-red-500 flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
          <div className="flex gap-6 mt-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'products' ? 'border-brand-sageDark text-brand-sageDark' : 'border-transparent text-brand-text/60 hover:text-brand-brown'}`}
            >
              <span className="flex items-center gap-2"><ShoppingBag size={18} /> Manage Products</span>
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'content' ? 'border-brand-sageDark text-brand-sageDark' : 'border-transparent text-brand-text/60 hover:text-brand-brown'}`}
            >
              <span className="flex items-center gap-2"><Layout size={18} /> Edit Pages</span>
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
  const [isAiGenerating, setIsAiGenerating] = useState(false);
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
    if (!window.confirm("This will upload all demo products to your Firebase database. Continue?")) return;
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

  const handleAiAutoFill = async () => {
    if (!imageFile) return;
    setIsAiGenerating(true);
    try {
      const aiData = await generateProductDetailsFromImage(imageFile);
      setFormData(prev => ({
        ...prev,
        ...aiData
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to auto-generate details. Please try again.");
    } finally {
      setIsAiGenerating(false);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-rose/20 sticky top-24">
          <h2 className="text-xl font-serif font-bold text-brand-brown mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          {successMsg && (
            <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Image Upload */}
             <div>
                <label className="block text-xs font-bold text-brand-brown mb-1">Image</label>
                <div className="relative">
                   {preview && (
                     <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                   )}
                   <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImageFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-rose file:text-brand-brown"
                    />
                </div>
                
                {imageFile && !editingId && (
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiGenerating}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-sageDark to-brand-sage text-white py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    {isAiGenerating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Analyzing Pattern...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Magic Auto-Fill
                      </>
                    )}
                  </button>
                )}
              </div>

              <input 
                placeholder="Product Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
              />
              
              <div className="flex gap-2">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-1/2 px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
                >
                  <option value="Bags">Bags</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Baby">Baby</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                  className="w-1/2 px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
                />
              </div>

              <textarea 
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />
              
              <input 
                placeholder="Materials"
                value={formData.materials}
                onChange={e => setFormData({...formData, materials: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />

              <input 
                placeholder="Care Instructions"
                value={formData.care}
                onChange={e => setFormData({...formData, care: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="feat" className="text-sm">Feature on Homepage</label>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={isLoading || isAiGenerating}
                  className="flex-1 bg-brand-sageDark text-white py-2 rounded-lg font-bold hover:bg-brand-brown transition-colors flex justify-center items-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18}/> : <Plus size={18} />)}
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600 font-bold">
                    Cancel
                  </button>
                )}
              </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-serif font-bold text-brand-brown">Inventory ({products.length})</h2>
           {isMockData && (
             <button 
                onClick={handleSeedDatabase}
                disabled={isLoading}
                className="bg-brand-rose text-brand-brown px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-roseDark transition-colors"
             >
                {isLoading ? <Loader2 className="animate-spin" size={16}/> : <Database size={16}/>}
                Push Demo Data to Database
             </button>
           )}
        </div>
        
        {productsLoading ? (
           <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-sageDark"/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-brand-rose/10 flex gap-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-brand-brown truncate">{product.name}</h3>
                  <p className="text-sm text-brand-text/60 mb-2">${product.price}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title={isMockData ? "Demo data is read-only" : "Edit"}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title={isMockData ? "Demo data is read-only" : "Delete"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

  useEffect(() => {
    if (fetchedContent) {
      setFormData(fetchedContent);
    }
  }, [fetchedContent]);

  if (loading || !formData) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

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
      window.location.reload(); // Refresh to clear local preview blobs
    } catch (e) {
      console.error(e);
      alert('Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-brand-rose/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-brown">Edit Website Pages</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-brown text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-sageDark transition-colors flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Home Page Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-brand-sageDark uppercase tracking-widest border-b pb-2">Home Page Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">Hero Title</label>
              <textarea 
                value={formData.heroTitle}
                onChange={e => handleChange('heroTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
                rows={2}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">Hero Subtitle</label>
              <textarea 
                value={formData.heroSubtitle}
                onChange={e => handleChange('heroSubtitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ImageUploader 
                label="Hero Image 1 (Left/Top)" 
                currentUrl={formData.heroImage1} 
                previewUrl={previews['heroImage1']}
                onChange={(f) => handleFileChange('heroImage1', f)} 
             />
             <ImageUploader 
                label="Hero Image 2 (Right/Bottom)" 
                currentUrl={formData.heroImage2} 
                previewUrl={previews['heroImage2']}
                onChange={(f) => handleFileChange('heroImage2', f)} 
             />
          </div>
        </section>

        {/* About Page Section */}
        <section className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-brand-sageDark uppercase tracking-widest border-b pb-2">About Page</h3>
          
          <div>
            <label className="block text-sm font-bold text-brand-brown mb-1">About Title</label>
            <input 
              value={formData.aboutTitle}
              onChange={e => handleChange('aboutTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-brand-brown mb-1">Paragraph 1</label>
                <textarea 
                  value={formData.aboutText1}
                  onChange={e => handleChange('aboutText1', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 h-32"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-brand-brown mb-1">Paragraph 2</label>
                <textarea 
                  value={formData.aboutText2}
                  onChange={e => handleChange('aboutText2', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30 h-32"
                />
             </div>
          </div>

           <ImageUploader 
              label="About Page Image" 
              currentUrl={formData.aboutImage} 
              previewUrl={previews['aboutImage']}
              onChange={(f) => handleFileChange('aboutImage', f)} 
           />
        </section>

        {/* Contact Info */}
        <section className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-brand-sageDark uppercase tracking-widest border-b pb-2">Contact & Socials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">Email Address</label>
              <input 
                value={formData.contactEmail}
                onChange={e => handleChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">Phone Display Text</label>
              <input 
                value={formData.contactPhone}
                onChange={e => handleChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">WhatsApp Number (No spaces)</label>
              <input 
                value={formData.whatsappNumber}
                onChange={e => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-brand-brown mb-1">Instagram URL</label>
              <input 
                value={formData.instagramUrl}
                onChange={e => handleChange('instagramUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-brand-rose/30 bg-brand-cream/30"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ImageUploader: React.FC<{
  label: string, 
  currentUrl: string, 
  previewUrl?: string, 
  onChange: (f: File) => void
}> = ({ label, currentUrl, previewUrl, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-brand-brown mb-1">{label}</label>
    <div className="flex gap-4 items-start">
      <img 
        src={previewUrl || currentUrl} 
        alt="Preview" 
        className="w-24 h-24 object-cover rounded-lg bg-gray-100 border border-brand-rose/20" 
      />
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-rose file:text-brand-brown hover:file:bg-brand-roseDark"
      />
    </div>
  </div>
);

export default Admin;