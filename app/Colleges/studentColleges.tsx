'use client';

import { useState } from 'react';
import { MapPin, Menu, Bell } from 'lucide-react';

interface College {
  id: number;
  name: string;
  location: string;
  description: string;
  program?: string;
  status?: string;
  buttonColor?: 'cyan' | 'yellow' | 'green' | 'teal';
  buttonAction?: string;
}

export default function StudentColleges() {
  const [colleges, setColleges] = useState<College[]>([
    {
      id: 1,
      name: 'University of the Philippines',
      location: 'Quezon City, Philippines',
      description: 'Leading national university',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 2,
      name: 'Ateneo de Manila University',
      location: 'Quezon City, Philippines',
      description: 'Private Catholic institution',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 3,
      name: 'De La Salle University',
      location: 'Manila, Philippines',
      description: 'Lasallian educational excellence',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 4,
      name: 'Polytechnic University of the Philippines',
      location: 'Manila, Philippines',
      description: 'Technical university leading innovation',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 5,
      name: 'University of Santo Tomas',
      location: 'Manila, Philippines',
      description: 'Oldest Catholic university in the Philippines',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 6,
      name: 'Mapúa University',
      location: 'Manila, Philippines',
      description: 'Excellence in science and technology education',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 7,
      name: 'University of Asia and the Pacific',
      location: 'Makati, Philippines',
      description: 'Premier business and economics school',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
    {
      id: 8,
      name: 'Adamson University',
      location: 'Manila, Philippines',
      description: 'Jesuit-founded technological university',
      status: 'Available',
      buttonColor: 'cyan',
      buttonAction: 'APPLY',
    },
  ]);

  const getButtonColor = (color?: string) => {
    return 'bg-cyan-400 hover:bg-cyan-500 text-white';
  };

  const handleEdit = (id: number) => {
    console.log('Apply to college:', id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-full mx-auto">
          {/* Left - Menu and Logo */}
          <div className="flex items-center gap-6">
            <Menu size={24} className="text-gray-900 cursor-pointer" />
            <span className="text-xl font-bold text-gray-900">COLLAPP</span>
          </div>

          {/* Right - Notification and Profile */}
          <div className="flex items-center gap-6">
            <Bell size={24} className="text-gray-900 cursor-pointer hover:text-gray-600 transition" />
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition">
              <span className="text-white font-bold text-sm">J</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-8">
        <div className="max-w-4xl mx-auto bg-gray-200 rounded-2xl p-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">AVAILABLE COLLEGES</h1>

            {/* Search and Filter Bar */}
            <div className="flex gap-4 mb-8 bg-white rounded-xl p-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="SEARCH"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition">
                REGION ▼
              </button>
            </div>
          </div>

          {/* Colleges List */}
          <div className="space-y-4">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition"
              >
                {/* Header with College Name and Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
                  <span className="text-xs font-medium text-gray-600">{college.status || 'Available'}</span>
                </div>

                {/* Required Documents Section */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs font-bold text-gray-900 mb-2">REQUIRED DOCUMENTS</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">Transcript</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">School Certificate</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">Form 138</span>
                  </div>
                </div>

                {/* Deadline and Action Button */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">Deadline: March 15, 2025</p>
                  <button
                    onClick={() => handleEdit(college.id)}
                    className={`px-6 py-2 rounded-full font-bold text-xs transition whitespace-nowrap ${getButtonColor(
                      college.buttonColor
                    )}`}
                  >
                    {college.buttonAction || 'APPLY'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
