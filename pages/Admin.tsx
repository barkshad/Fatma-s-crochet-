import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Plus, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Product } from '../types';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Bags',
    price: 0,
    image: '',
    description: '',
    materials: '',
    care: '',
    isFeatured: false
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Image to Cloudinary
      const imageUrl = await uploadToCloudinary(imageFile);

      // 2. Save Data to Firestore
      await addDoc(collection(db, "products"), {
        ...formData,
        price: Number(formData.price),
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({
        name: '',
        category: 'Bags',
        price: 0,
        image: '',
        description: '',
        materials: '',
        care: '',
        isFeatured: false
      });
      setImageFile(null);
      setPreview(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error saving product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-brand-rose/20 overflow-hidden">
        <div className="bg-brand-brown text-white p-6">
          <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
          <p className="opacity-80">Add new products to your store</p>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle size={20} />
              Product added successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Image Upload */}
              <div className="col-span-full">
                <label className="block text-sm font-bold text-brand-brown mb-2">Product Image</label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${preview ? 'border-brand-sageDark bg-brand-sage/10' : 'border-brand-rose/30 hover:border-brand-sageDark'}`}>
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                      <button 
                        type="button" 
                        onClick={() => { setPreview(null); setImageFile(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <Plus size={20} className="rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={48} className="mx-auto text-brand-brown/40 mb-2" />
                      <p className="text-brand-text/60 mb-2">Drag and drop or click to upload</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-rose file:text-brand-brown hover:file:bg-brand-roseDark"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-bold text-brand-brown mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-brown mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                >
                  <option value="Bags">Bags</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Baby">Baby</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-brown mb-1">Price ($)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                />
              </div>

               <div className="flex items-center pt-6">
                <input 
                  type="checkbox" 
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-5 h-5 rounded border-brand-rose/30 text-brand-sageDark focus:ring-brand-sageDark"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm font-bold text-brand-brown">Feature on Homepage</label>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-bold text-brand-brown mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                />
              </div>

              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-bold text-brand-brown mb-1">Materials</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 100% Cotton"
                  value={formData.materials}
                  onChange={e => setFormData({...formData, materials: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                />
              </div>

              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-bold text-brand-brown mb-1">Care Instructions</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Hand wash cold"
                  value={formData.care}
                  onChange={e => setFormData({...formData, care: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-brand-cream/30"
                />
              </div>

            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-sageDark hover:bg-brand-brown text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
              {loading ? 'Uploading...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
