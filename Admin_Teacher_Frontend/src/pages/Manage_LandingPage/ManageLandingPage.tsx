
import { NavLink, Outlet } from 'react-router-dom';

export const LandingPageDetail = {
  home: {
    carousel: [
      {
        title: "Welcome to Our School",
        description: "Empowering minds, shaping futures",
        url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
      },
      {
        title: "Excellence in Education",
        description: "Nurturing talent, fostering growth",
        url: "https://th.bing.com/th/id/OIP.ZUDgXGa2D1KpDLrp-PAvcAHaEJ?w=314&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
      },
      {
        title: "Innovative Learning",
        description: "Preparing students for tomorrow's challenges",
        url: "https://th.bing.com/th/id/OIP.ZUDgXGa2D1KpDLrp-PAvcAHaEJ?w=314&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
      },
    ],
    aboutOurSchool: {
      url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
      title: "About Our School",
      description: "Empowering minds, shaping futures",
    }
  },
  about: {
    aboutOurSchool: {
      url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
      title: "About Our School",
      description: "Empowering minds, shaping futures",
    }, 
    leadership: [
      {
        name: "John Doe",
        role: "Principal",
        description: "Mr Vyas Smith brings over 20 years of experience in education leadership. Her vision for our school focuses on fostering innovation, inclusivity, and academic excellence.",
        url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
      },
      {
        name: "Jane Doe",
        role: "Vice Principal",
        description: "Mr Vyas Smith brings over 20 years of experience in education leadership. Her vision for our school focuses on fostering innovation, inclusivity, and academic excellence.",
        url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
      }
    ]
  },
  gallery: [
    {
      type: 'video',
      title: "Sports Day",
      url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
    },
    {
      type: 'video',
      title: "Science Fair",
      url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
    },
    {
      type: 'photo',
      title: "Art Exhibition",
      url: "https://th.bing.com/th/id/OIP.j1FyuMTYQdV8bOmnI2rMTgHaDt?w=341&h=174&c=7&r=0&o=5&dpr=2&pid=1.7",
    }
  ]
};


const ManageLandingPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Manage Images</h1>
      <nav className="mb-6">
        <ul className="flex space-x-4">
          <li>
            <NavLink to="" className="text-blue-500 hover:underline">Home Page</NavLink>
          </li>
          <li>
            <NavLink to="about" className="text-blue-500 hover:underline">About Page</NavLink>
          </li>
          <li>
            <NavLink to="gallery" className="text-blue-500 hover:underline">Gallery Page</NavLink>
          </li>
        </ul>
      </nav>
    </div>
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <Outlet />
    </div>
  </div>
  );
};


export default ManageLandingPage;
