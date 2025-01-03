import React, { useState } from 'react';
import { LandingPageDetail } from './ManageLandingPage';

const LandingPageHome = () => {
    const [landingPageDetail, setLandingPageDetail] = useState(LandingPageDetail);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, section: string, index?: number) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e : any) => {
                if (e.target?.result) {
                    setLandingPageDetail((prevlandingPageDetail) => {
                        const newlandingPageDetail = { ...prevlandingPageDetail };
                        if (section === 'carousel' && index !== undefined) {
                            newlandingPageDetail.home.carousel[index].url = e.target.result as string;
                        } else if (section === 'aboutOurSchool') {
                            newlandingPageDetail.home.aboutOurSchool.url = e.target.result as string;
                        }
                        return newlandingPageDetail;
                    });
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, index?: number, field?: string) => {
        const { value } = event.target;
        setLandingPageDetail((prevlandingPageDetail) => {
            const newlandingPageDetail: any = { ...prevlandingPageDetail };
            if (section === 'carousel' && index !== undefined && field) {
                newlandingPageDetail.home.carousel[index][field] = value;
            } else if (section === 'aboutOurSchool' && field) {
                newlandingPageDetail.home.aboutOurSchool[field] = value;
            }
            return newlandingPageDetail;
        });
    };

    const handleAddCarouselItem = () => {
        setLandingPageDetail((prevlandingPageDetail) => ({
            ...prevlandingPageDetail,
            home: {
                ...prevlandingPageDetail.home,
                carousel: [
                    ...prevlandingPageDetail.home.carousel,
                    { title: 'New Title', description: 'New Description', url: '' },
                ],
            },
        }));
    };

    const handleRemoveCarouselItem = (index: number) => {
        setLandingPageDetail((prevlandingPageDetail) => {
            const newlandingPageDetail = { ...prevlandingPageDetail };
            newlandingPageDetail.home.carousel.splice(index, 1);
            return newlandingPageDetail;
        });
    };

    const handleSave = () => {
        console.log('Saved landingPageDetail:', landingPageDetail);
    };

    const handleReset = () => {
        setLandingPageDetail(LandingPageDetail);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Home Page</h2>
            <h3 className="text-lg font-semibold mb-2">Carousel landingPageDetail</h3>
            <button onClick={handleAddCarouselItem} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                Add Image
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {landingPageDetail.home.carousel.map((image, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md shadow-md">
                        <img src={image.url} alt={image.title} className="w-full h-40 object-cover rounded-md mb-4" />
                        <input type="file" onChange={(e) => handleImageChange(e, 'carousel', index)} className="mb-2" />
                        <input type="text" value={image.title} onChange={(e) => handleTextChange(e, 'carousel', index, 'title')} className="mb-2 w-full p-2 border rounded-md" placeholder="Title" />
                        <textarea value={image.description} onChange={(e) => handleTextChange(e, 'carousel', index, 'description')} className="mb-2 w-full p-2 border rounded-md" placeholder="Description" />
                        <button onClick={() => handleRemoveCarouselItem(index)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">About Our School</h2>
                <div className="bg-gray-50 p-4 rounded-md shadow-md">
                    <img src={landingPageDetail.home.aboutOurSchool.url} alt={landingPageDetail.home.aboutOurSchool.title} className="w-full h-40 object-cover rounded-md mb-4" />
                    <input type="file" onChange={(e) => handleImageChange(e, 'aboutOurSchool')} className="mb-2" />
                    <input type="text" value={landingPageDetail.home.aboutOurSchool.title} onChange={(e) => handleTextChange(e, 'aboutOurSchool', undefined, 'title')} className="mb-2 w-full p-2 border rounded-md" placeholder="Title" />
                    <textarea value={landingPageDetail.home.aboutOurSchool.description} onChange={(e) => handleTextChange(e, 'aboutOurSchool', undefined, 'description')} className="mb-2 w-full p-2 border rounded-md" placeholder="Description" />
                </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
          <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">Reset</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">Save</button>
        </div>
        </div>
    );
};

export default LandingPageHome;
