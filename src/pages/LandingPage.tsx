import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/PhotoCapture');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-pink-50 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-pink-50 p-4 sm:p-6 border-b border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GM</span>
            </div>
            <div className="flex gap-2">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-pink-300 rounded"></div>
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-pink-300 rounded"></div>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-pink-800 mb-2">GENTLE MONSTER</h1>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-800 mb-4 sm:mb-6">
            AI STUDENT ID CARD
          </h2>
          
          <p className="text-sm sm:text-base text-pink-600 mb-6 sm:mb-8 leading-relaxed">
            Gentle Monster's 2024 Optical Collection invites you to dive 
            into the Gentle High School experience. Start your student 
            life at Gentle High School by obtaining your AI student ID.
          </p>

          <button
            onClick={handleStartClick}
            className="w-full bg-pink-500 text-white py-3 sm:py-4 px-6 rounded-none font-medium text-base sm:text-lg hover:bg-pink-600 transition-colors duration-200 mb-6 sm:mb-8"
          >
            獲取你的 AI 學生證
          </button>

          {/* Phone Mockup - Responsive */}
          <div className="relative mx-auto w-40 h-80 sm:w-48 sm:h-96 bg-black rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-xl">
            <div className="w-full h-full bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-4 sm:h-6 bg-black rounded-b-xl sm:rounded-b-2xl z-10"></div>
              
              {/* Screen Content */}
              <div className="pt-6 sm:pt-8 px-3 sm:px-4 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-28 h-36 sm:w-32 sm:h-40 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-gradient-to-b from-orange-200 to-orange-300 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-16 sm:w-16 sm:h-20 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom UI */}
                <div className="pb-6 sm:pb-8 flex justify-center gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full"></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;