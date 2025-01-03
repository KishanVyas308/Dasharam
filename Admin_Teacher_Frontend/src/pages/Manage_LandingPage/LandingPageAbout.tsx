import React, { useState } from 'react';
import { LandingPageDetail } from './ManageLandingPage';

const LandingPageAbout = () => {
  const [landingPageDetail, setLandingPageDetail] = useState(LandingPageDetail);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target?.result) {
          setLandingPageDetail((prevImages) => {
            const newImages = { ...prevImages };
            if (section === 'aboutOurSchool') {
              newImages.about.aboutOurSchool.url = e.target.result as string;
            } else if (section === 'leadership' && index !== undefined) {
              newImages.about.leadership[index].url = e.target.result as string;
            }
            return newImages;
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, index?: number, field?: string) => {
    const { value } = event.target;
    setLandingPageDetail((prevImages) => {
      const newImages: any = { ...prevImages };
      if (section === 'aboutOurSchool' && field) {
        newImages.aboutOurSchool[field] = value;
      } else if (section === 'leadership' && index !== undefined && field) {
        newImages.leadership[index][field] = value;
      }
      return newImages;
    });
  };

  const handleAddLeader = () => {
    setLandingPageDetail((prevImages) => ({
      ...prevImages,
      leadership: [...prevImages.about.leadership, { url: '', name: '', role: '', description: '' }],
    }));
  };

  const handleRemoveLeader = (index: number) => {
    setLandingPageDetail((prevImages) => {
      const newImages = { ...prevImages };
      newImages.about.leadership.splice(index, 1);
      return newImages;
    });
  };

  const handleSave = () => {
    console.log('Saved about images:', landingPageDetail);
  };

  const handleReset = () => {
    setLandingPageDetail(LandingPageDetail);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About Page</h2>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">About Our School</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          <img src={landingPageDetail.about.aboutOurSchool.url} alt={landingPageDetail.about.aboutOurSchool.title} className="w-full h-40 object-cover rounded-md mb-4" />
          <input type="file" onChange={(e) => handleImageChange(e, 'aboutOurSchool')} className="mb-2" />
          <input type="text" value={landingPageDetail.about.aboutOurSchool.title} onChange={(e) => handleTextChange(e, 'aboutOurSchool', undefined, 'title')} className="mb-2 w-full p-2 border rounded-md" placeholder="Title" />
          <textarea value={landingPageDetail.about.aboutOurSchool.description} onChange={(e) => handleTextChange(e, 'aboutOurSchool', undefined, 'description')} className="mb-2 w-full p-2 border rounded-md" placeholder="Description" />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landingPageDetail.about.leadership.map((leader, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md shadow-md">
              <img src={leader.url} alt={leader.name} className="w-full h-40 object-cover rounded-md mb-4" />
              <input type="file" onChange={(e) => handleImageChange(e, 'leadership', index)} className="mb-2" />
              <input type="text" value={leader.name} onChange={(e) => handleTextChange(e, 'leadership', index, 'name')} className="mb-2 w-full p-2 border rounded-md" placeholder="Name" />
              <input type="text" value={leader.role} onChange={(e) => handleTextChange(e, 'leadership', index, 'role')} className="mb-2 w-full p-2 border rounded-md" placeholder="Role" />
              <textarea value={leader.description} onChange={(e) => handleTextChange(e, 'leadership', index, 'description')} className="mb-2 w-full p-2 border rounded-md" placeholder="Description" />
              <button onClick={() => handleRemoveLeader(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">Remove</button>
            </div>
          ))}
        </div>
        <button onClick={handleAddLeader} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">Add Leader</button>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">Reset</button>
        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">Save</button>
      </div>
    </div>
  );
};

export default LandingPageAbout;
