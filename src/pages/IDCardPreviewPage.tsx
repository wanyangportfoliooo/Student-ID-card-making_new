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
    
    console.log('Loading from sessionStorage:');
    console.log('savedInfo:', savedInfo);
    console.log('savedPhoto length:', savedPhoto ? savedPhoto.length : 'null');
    
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      // 確保照片也被載入
      if (savedPhoto) {
        parsedInfo.photo = savedPhoto;
      }
      console.log('Final studentInfo:', parsedInfo);
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

    // Set high resolution with padding for shadow and rounded corners
    const scale = 3;
    const cardWidth = 350;
    const cardHeight = 560;
    const padding = 40; // Space for shadow and rounded corners
    canvas.width = (cardWidth + padding * 2) * scale;
    canvas.height = (cardHeight + padding * 2) * scale;
    ctx.scale(scale, scale);

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);

    // Create shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Create rounded rectangle for the card
    const cardX = padding;
    const cardY = padding;
    const cornerRadius = 20;

    // Draw card background with rounded corners
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cornerRadius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Reset shadow for content
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Main content area (with rounded corners)
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, 290, cardHeight, cornerRadius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Side panel (with rounded corners)
    const gradient = ctx.createLinearGradient(cardX + 290, cardY, cardX + cardWidth, cardY);
    gradient.addColorStop(0, '#991b1b');
    gradient.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(cardX + 290, cardY, 60, cardHeight, cornerRadius);
    ctx.fill();

    // School name header
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('GENTLE HIGH SCHOOL', cardX + 280, cardY + 40);

    // Name section
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NAME', cardX + 20, cardY + 200);
    
    // Name line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 20, cardY + 210);
    ctx.lineTo(cardX + 270, cardY + 210);
    ctx.stroke();
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(studentInfo.name, cardX + 20, cardY + 230);

    // Optical ID section
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('OPTICAL ID', cardX + 20, cardY + 260);
    
    ctx.strokeStyle = '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(cardX + 20, cardY + 270);
    ctx.lineTo(cardX + 270, cardY + 270);
    ctx.stroke();
    
    const opticalId = studentInfo.birthday ? 
      new Date(studentInfo.birthday).toLocaleDateString().replace(/\//g, '') : 
      '20240101';
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(opticalId, cardX + 20, cardY + 290);

    // Year and Optical
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('2024', cardX + 20, cardY + 450);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('OPTICAL', cardX + 20, cardY + 480);

    // School badge
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cardX + 250, cardY + 450, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#f9fafb';
    ctx.fill();
    
    ctx.fillStyle = '#4b5563';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GHS', cardX + 250, cardY + 455);

    // Side panel text
    ctx.save();
    ctx.translate(cardX + 320, cardY + 280);
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
        console.log('Photo loaded successfully:', img.width, 'x', img.height);
        // Draw photo with proper aspect ratio
        const photoX = cardX + 20;
        const photoY = cardY + 20;
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
      img.onerror = (error) => {
        console.error('Failed to load photo:', error);
        console.log('Photo URL:', studentInfo.photo);
        setIsDownloading(false);
        alert('Failed to load photo. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-pink-50 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-pink-50 p-4 sm:p-6 border-b border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="text-pink-600 hover:text-pink-800 transition-colors" aria-label="Go back to previous page">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GM</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-pink-800 mb-2">GENTLE MONSTER</h1>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-800 mb-6">
            YOUR STUDENT ID
          </h2>
          
          <p className="text-pink-600 mb-8 leading-relaxed">
            Congratulations! Your Gentle High School student ID has been generated. 
            Download it to complete your enrollment.
          </p>

          {/* ID Card Preview */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:scale-105 transition-transform duration-300 mb-8 mx-auto" style={{width: '280px', height: '448px'}}>
            <div className="flex h-full">
              <div className="p-4 flex flex-col" style={{width: '232px'}}>
                <div className="w-20 h-26 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mb-4" style={{width: '80px', height: '104px'}}>
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
                    <div className="text-2xl font-bold text-red-600">2024</div>
                    <div className="text-sm text-red-600 font-medium">OPTICAL</div>
                  </div>
                  
                  <div className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50">
                    <div className="text-xs text-center text-gray-600 font-bold leading-tight">
                      <div>GHS</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-15 bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center" style={{width: '48px'}}>
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
              className={`w-full bg-pink-500 text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-pink-600 transition-colors duration-200 ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className="w-5 h-5 inline mr-2" />
              {isDownloading ? '生成中...' : '下載學生證'}
            </button>
            
            {isDownloading && (
              <p className="text-center text-gray-500 text-sm">
                Creating high-quality image...
              </p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-pink-200 text-pink-800 py-3 px-4 rounded-xl font-medium hover:bg-pink-300 transition-colors duration-200"
              >
                編輯資料
              </button>
              
              <button
                onClick={handleStartOver}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重新開始
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardPreviewPage;
