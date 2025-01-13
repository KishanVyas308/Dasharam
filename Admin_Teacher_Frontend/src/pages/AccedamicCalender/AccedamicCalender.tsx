import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Event {
  id: number;
  date: string;
  day: string;
  name: string;
  description: string;
}

const AcademicCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const addEvent = () => {
    if (!startDate || !eventName.trim()) {
      alert("Please select a date and provide an event name.");
      return;
    }

    const newEvents: Event[] = [];

    if (endDate && startDate < endDate) {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        newEvents.push(createEvent(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      newEvents.push(createEvent(startDate));
    }

    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    clearForm();
  };

  const createEvent = (date: Date): Event => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return {
      id: Date.now() + Math.random(),
      date: date.toISOString().split("T")[0],
      day: daysOfWeek[date.getDay()],
      name: eventName,
      description: eventDescription,
    };
  };

  const clearForm = () => {
    setStartDate(null);
    setEndDate(null);
    setEventName("");
    setEventDescription("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Academic Calendar</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event/holiday name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Enter event/holiday description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Date(s)
          </label>
          <DatePicker
            selected={startDate ?? new Date()}
            onChange={(date) => setStartDate(date)}
            startDate={startDate ?? new Date()}
            endDate={endDate ?? undefined}
            selectsStart
            placeholderText="Start Date"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <DatePicker
            selected={endDate ?? new Date()}
            onChange={(date) => setEndDate(date)}
            startDate={startDate ?? new Date()}
            endDate={endDate ?? undefined}
            selectsEnd
            placeholderText="End Date (optional)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
          />
        </div>
      </div>

      <button
        onClick={addEvent}
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
      >
        Add Event
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Event List</h2>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Sr. No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Event Name</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className="odd:bg-gray-100 even:bg-gray-200">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{event.date}</td>
                <td className="px-4 py-2">{event.day}</td>
                <td className="px-4 py-2">{event.name}</td>
                <td className="px-4 py-2">{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicCalendar;