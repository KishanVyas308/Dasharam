import React, { useState } from 'react';
import { LandingPageDetail } from './ManageLandingPage';

const LandingPageGallery = () => {
    const [landingPageDetail, setLandingPageDetail] = useState(LandingPageDetail);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target?.result) {
                    setLandingPageDetail((prevImages) => {
                        const newImages = { ...prevImages };
                        newImages.gallery[index].url = e.target.result as string;
                        return newImages;
                    });
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number, field: string) => {
        const { value } = event.target;
        setLandingPageDetail((prevImages) => {
            const newImages: any = { ...prevImages };
            newImages.gallery[index][field] = value;
            return newImages;
        });
    };

    const handleAddGalleryItem = () => {
        setLandingPageDetail((prevImages) => ({
            ...prevImages,
            gallery: [...prevImages.gallery, { type: 'photo', title: 'New Title', url: '' }],
        }));
    };

    const handleRemoveGalleryItem = (index: number) => {
        setLandingPageDetail((prevImages) => {
            const newImages = { ...prevImages };
            newImages.gallery.splice(index, 1);
            return newImages;
        });
    };

    const handleSave = () => {
        console.log('Saved gallery images:', landingPageDetail);
    };

    const handleReset = () => {
        setLandingPageDetail(LandingPageDetail);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Gallery Page</h2>
            <button onClick={handleAddGalleryItem} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                Add Gallery Item
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {landingPageDetail.gallery.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md shadow-md">
                        {item.type === 'photo' ? (
                            <img src={item.url} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
                        ) : (
                            <iframe src={item.url
                                .replace('watch?v=', 'embed/')
                                .replace('youtu.be/', 'youtube.com/embed/')} className="w-full h-40 rounded-md mb-4" />
                        )}
                        {item.type === 'photo' ? (
                            <input type="file" onChange={(e) => handleImageChange(e, index)} className="mb-2" />
                        ) : (
                            <input type="text" value={item.url} onChange={(e) => handleTextChange(e, index, 'url')} className="mb-2 w-full p-2 border rounded-md" placeholder="Video URL" />
                        )}
                        <input type="text" value={item.title} onChange={(e) => handleTextChange(e, index, 'title')} className="mb-2 w-full p-2 border rounded-md" placeholder="Title" />
                        <select value={item.type} onChange={(e) => handleTextChange(e, index, 'type')} className="mb-2 w-full p-2 border rounded-md">
                            <option value="photo">Photo</option>
                            <option value="video">Video</option>
                        </select>
                        <button onClick={() => handleRemoveGalleryItem(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end space-x-4">
                <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">Reset</button>
                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">Save</button>
            </div>
        </div>
    );
};

export default LandingPageGallery;
