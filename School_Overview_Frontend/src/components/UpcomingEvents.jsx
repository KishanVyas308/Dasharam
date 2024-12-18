import React from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const events = [
  {
    title: 'Annual Science Fair',
    date: 'May 15, 2023',
    time: '10:00 AM - 4:00 PM',
    location: 'School Gymnasium',
    attendees: '500+ expected',
    description: 'Showcase of innovative student projects across all scientific disciplines.',
  },
  {
    title: 'Parent-Teacher Conference',
    date: 'June 5, 2023',
    time: '3:00 PM - 7:00 PM',
    location: 'Various Classrooms',
    attendees: 'All parents and guardians',
    description: 'One-on-one meetings to discuss student progress and address any concerns.',
  },
  {
    title: 'Summer Arts Festival',
    date: 'July 1-3, 2023',
    time: 'All Day',
    location: 'School Grounds',
    attendees: 'Open to public',
    description: 'A celebration of creativity featuring student performances, art exhibitions, and workshops.',
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 hover:text-[#0d9488] transition duration-300">
                {event.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <FaCalendarAlt className="w-5 h-5 mr-2 text-[#0d9488]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <FaClock className="w-5 h-5 mr-2 text-[#0d9488]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <FaMapMarkerAlt className="w-5 h-5 mr-2 text-[#0d9488]" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaUsers className="w-5 h-5 mr-2 text-[#0d9488]" />
                <span>{event.attendees}</span>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <button className="bg-[#0d9488] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0b7c6f] transition duration-300">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
