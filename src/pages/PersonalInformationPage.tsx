import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, ArrowLeft } from 'lucide-react';

interface StudentInfo {
  name: string;
  birthday: string;
}

const PersonalInformationPage: React.FC = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    birthday: ''
  });

  const handleInfoChange = (info: Partial<StudentInfo>) => {
    setStudentInfo(prev => ({ ...prev, ...info }));
  };

  const handleNext = () => {
    if (!studentInfo.name || !studentInfo.birthday) {
      alert('Please complete all fields before proceeding.');
      return;
    }

    // Save student info to sessionStorage
    sessionStorage.setItem('studentInfo', JSON.stringify(studentInfo));
    navigate('/IDCardPreview');
  };

  const handleBack = () => {
    navigate('/PhotoCapture');
  };

  const canProceed = !!(studentInfo.name && studentInfo.birthday);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GM</span>
            </div>
            <button onClick={handleBack} className="text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">GENTLE MONSTER</h1>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
            PERSONAL INFORMATION
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Fill in your personal information to complete your Gentle High School student ID card.
          </p>

          {/* Form */}
          <div className="space-y-6 text-left">
            <div className="relative">
              <input
                type="text"
                id="name"
                value={studentInfo.name}
                onChange={(e) => handleInfoChange({ name: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
              <label htmlFor="name" className="absolute -top-2 left-4 text-sm text-black bg-white px-2 rounded font-medium">
                Full Name
              </label>
            </div>
            
            <div className="relative">
              <input
                type="date"
                id="birthday"
                value={studentInfo.birthday}
                onChange={(e) => handleInfoChange({ birthday: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
              <label htmlFor="birthday" className="absolute -top-2 left-4 text-sm text-black bg-white px-2 rounded font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`w-full bg-black text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-gray-900 transition-colors duration-200 mb-4 ${
                !canProceed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Continue to Student ID
            </button>
            
            {!canProceed && (
              <p className="text-center text-gray-500 text-sm">
                Please complete all fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationPage;
