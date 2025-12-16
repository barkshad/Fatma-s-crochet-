export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mati_unsigned');
  formData.append('cloud_name', 'dycbotqpw');

  const resourceType = file.type.includes('video') ? 'video' : 'image';
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dycbotqpw/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};