import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, RotateCcw, User } from 'lucide-react';

interface StudentInfo {
  name: string;
  birthday: string;
  photo?: string;
}

const IDCardPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    birthday: '',
    photo: undefined
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // Load student info from sessionStorage on component mount
  useEffect(() => {
    const savedInfo = sessionStorage.getItem('studentInfo');
    const savedPhoto = sessionStorage.getItem('capturedPhoto');
    
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      setStudentInfo(parsedInfo);
    } else if (savedPhoto) {
      setStudentInfo(prev => ({ ...prev, photo: savedPhoto }));
    }
  }, []);

  const handleDownload = () => {
    if (!studentInfo.name || !studentInfo.birthday || !studentInfo.photo) {
      alert('Missing information. Please go back and complete all fields.');
      return;
    }

    setIsDownloading(true);

    // Create high-quality ID card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Set high resolution
    const scale = 3;
    canvas.width = 350 * scale;
    canvas.height = 560 * scale;
    ctx.scale(scale, scale);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 350, 560);

    // Main content area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 290, 560);

    // Side panel
    const gradient = ctx.createLinearGradient(290, 0, 350, 0);
    gradient.addColorStop(0, '#991b1b');
    gradient.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = gradient;
    ctx.fillRect(290, 0, 60, 560);

    // School name header
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('GENTLE HIGH SCHOOL', 280, 40);

    // Name section
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NAME', 20, 200);
    
    // Name line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 210);
    ctx.lineTo(270, 210);
    ctx.stroke();
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(studentInfo.name, 20, 230);

    // Optical ID section
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('OPTICAL ID', 20, 260);
    
    ctx.strokeStyle = '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(20, 270);
    ctx.lineTo(270, 270);
    ctx.stroke();
    
    const opticalId = studentInfo.birthday ? 
      new Date(studentInfo.birthday).toLocaleDateString().replace(/\//g, '') : 
      '20240101';
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(opticalId, 20, 290);

    // Year and Optical
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('2024', 20, 450);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('OPTICAL', 20, 480);

    // School badge
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(250, 450, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#f9fafb';
    ctx.fill();
    
    ctx.fillStyle = '#4b5563';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GHS', 250, 455);

    // Side panel text
    ctx.save();
    ctx.translate(320, 280);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GENTLE HIGH SCHOOL', 0, 0);
    ctx.restore();

    // Draw photo
    if (studentInfo.photo) {
      const img = new Image();
      img.onload = () => {
        // Draw photo with proper aspect ratio
        const photoX = 20;
        const photoY = 20;
        const photoWidth = 100;
        const photoHeight = 130;
        
        const imgAspect = img.width / img.height;
        const targetAspect = photoWidth / photoHeight;
        
        let drawWidth = photoWidth;
        let drawHeight = photoHeight;
        let drawX = photoX;
        let drawY = photoY;
        
        if (imgAspect > targetAspect) {
          drawWidth = photoHeight * imgAspect;
          drawX = photoX - (drawWidth - photoWidth) / 2;
        } else {
          drawHeight = photoWidth / imgAspect;
          drawY = photoY - (drawHeight - photoHeight) / 2;
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoWidth, photoHeight);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
        
        // Photo border
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
        
        // Download the canvas as image
        const link = document.createElement('a');
        link.download = `${studentInfo.name.replace(/\s+/g, '_')}_student_id.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setIsDownloading(false);
      };
      img.src = studentInfo.photo;
    } else {
      // Download without photo
      const link = document.createElement('a');
      link.download = `${studentInfo.name.replace(/\s+/g, '_')}_student_id.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    }
  };

  const handleBack = () => {
    navigate('/PersonalInformation');
  };

  const handleStartOver = () => {
    // Clear session storage
    sessionStorage.removeItem('studentInfo');
    sessionStorage.removeItem('capturedPhoto');
    navigate('/LandingPage');
  };

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
            YOUR STUDENT ID
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Congratulations! Your Gentle High School student ID has been generated. 
            Download it to complete your enrollment.
          </p>

          {/* ID Card Preview */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:scale-105 transition-transform duration-300 mb-8">
            <div className="flex h-80">
              <div className="flex-1 p-4 flex flex-col">
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mb-4">
                  {studentInfo.photo ? (
                    <img src={studentInfo.photo} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="border-b border-gray-300 pb-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">NAME</div>
                    <div className="text-sm font-medium text-gray-800">
                      {studentInfo.name || 'Your Name'}
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-300 pb-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">OPTICAL ID</div>
                    <div className="text-sm font-medium text-gray-800">
                      {studentInfo.birthday ? new Date(studentInfo.birthday).toLocaleDateString().replace(/\//g, '') : '20240101'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <div className="text-xl font-bold text-red-600">2024</div>
                    <div className="text-xs text-red-600 font-medium">OPTICAL</div>
                  </div>
                  
                  <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50">
                    <div className="text-xs text-center text-gray-600 font-bold leading-tight">
                      <div>GHS</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-12 bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center">
                <div className="text-white text-xs font-bold transform rotate-90 whitespace-nowrap tracking-wider">
                  GENTLE HIGH SCHOOL
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full bg-black text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-gray-900 transition-colors duration-200 ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className="w-5 h-5 inline mr-2" />
              {isDownloading ? 'Generating...' : 'Download Student ID'}
            </button>
            
            {isDownloading && (
              <p className="text-center text-gray-500 text-sm">
                Creating high-quality image...
              </p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Edit Information
              </button>
              
              <button
                onClick={handleStartOver}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardPreviewPage;
