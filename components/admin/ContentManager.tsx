import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../hooks/useSiteContent';
import { SiteContent } from '../../types';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { Loader2, Save, Layout, FileText, Share2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentManager: React.FC = () => {
  const { content, loading } = useSiteContent();
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact'>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<{[key: string]: File | null}>({});
  const [previews, setPreviews] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  if (loading || !formData) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-sageDark"/></div>;

  const handleFileChange = (key: string, file: File) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const updatedData = { ...formData };
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const url = await uploadToCloudinary(file as File);
          (updatedData as any)[key] = url;
        }
      }
      await setDoc(doc(db, 'site_content', 'main'), updatedData);
      alert('Content updated!');
    } catch (e) {
      console.error(e);
      alert('Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-colors ${
        activeTab === id 
          ? 'bg-white text-brand-sageDark border-t-2 border-brand-sageDark shadow-[0_2px_10px_rgba(0,0,0,0.05)]' 
          : 'bg-transparent text-gray-500 hover:text-brand-brown hover:bg-white/50'
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-brand-brown font-serif">Website Content</h2>
           <p className="text-gray-500 text-sm">Update text, images, and contact details.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-brown text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-sageDark transition-colors flex items-center gap-2 shadow-lg"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Publish Changes
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <TabButton id="home" label="Home Page" icon={Layout} />
        <TabButton id="about" label="About Page" icon={FileText} />
        <TabButton id="contact" label="Contact & Social" icon={Share2} />
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-8 rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 min-h-[500px]"
      >
        {activeTab === 'home' && (
          <div className="space-y-8 max-w-3xl">
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="Hero Title" value={formData.heroTitle} onChange={v => setFormData({...formData, heroTitle: v})} />
              <InputGroup label="Hero Subtitle" value={formData.heroSubtitle} onChange={v => setFormData({...formData, heroSubtitle: v})} textarea />
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Hero Visuals</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <MediaUpload label="Background Video" preview={previews['heroBackgroundVideo'] || formData.heroBackgroundVideo} onChange={f => handleFileChange('heroBackgroundVideo', f)} isVideo />
                <div className="space-y-6">
                   <MediaUpload label="Floating Image 1" preview={previews['heroImage1'] || formData.heroImage1} onChange={f => handleFileChange('heroImage1', f)} />
                   <MediaUpload label="Floating Image 2" preview={previews['heroImage2'] || formData.heroImage2} onChange={f => handleFileChange('heroImage2', f)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8 max-w-3xl">
            <InputGroup label="About Heading" value={formData.aboutTitle} onChange={v => setFormData({...formData, aboutTitle: v})} />
            <div className="grid md:grid-cols-2 gap-6">
               <InputGroup label="Paragraph 1" value={formData.aboutText1} onChange={v => setFormData({...formData, aboutText1: v})} textarea rows={6} />
               <InputGroup label="Paragraph 2" value={formData.aboutText2} onChange={v => setFormData({...formData, aboutText2: v})} textarea rows={6} />
            </div>
            <MediaUpload label="About Page Image" preview={previews['aboutImage'] || formData.aboutImage} onChange={f => handleFileChange('aboutImage', f)} />
          </div>
        )}

        {activeTab === 'contact' && (
           <div className="space-y-6 max-w-2xl">
             <InputGroup label="Email Address" value={formData.contactEmail} onChange={v => setFormData({...formData, contactEmail: v})} />
             <InputGroup label="Phone (Display)" value={formData.contactPhone} onChange={v => setFormData({...formData, contactPhone: v})} />
             <InputGroup label="WhatsApp Number (No +)" value={formData.whatsappNumber} onChange={v => setFormData({...formData, whatsappNumber: v})} />
             <InputGroup label="Instagram URL" value={formData.instagramUrl} onChange={v => setFormData({...formData, instagramUrl: v})} />
           </div>
        )}
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, textarea, rows = 3 }: any) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    {textarea ? (
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        rows={rows}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none resize-none"
      />
    ) : (
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-sageDark outline-none"
      />
    )}
  </div>
);

const MediaUpload = ({ label, preview, onChange, isVideo }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{label}</label>
    <div className="relative group rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-brand-sageDark transition-colors h-48">
      {preview ? (
        isVideo && (preview.includes('.mp4') || preview.includes('video')) ? (
           <video src={preview} className="w-full h-full object-cover" muted />
        ) : (
           <img src={preview} className="w-full h-full object-cover" alt="preview" />
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
           <Upload size={24} />
           <span className="text-xs mt-2">Upload</span>
        </div>
      )}
      <input 
        type="file" 
        accept={isVideo ? "video/*" : "image/*"}
        onChange={e => e.target.files?.[0] && onChange(e.target.files[0])}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-white font-bold text-sm">Change File</span>
      </div>
    </div>
  </div>
);

export default ContentManager;