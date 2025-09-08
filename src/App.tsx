import React, { useState } from 'react';
import { Camera, User, Calendar, Download, RotateCcw, ArrowLeft, RefreshCw } from 'lucide-react';

// Types
interface StudentInfo {
  name: string;
  birthday: string;
  photo?: string;
}

type AppView = 'landing' | 'info' | 'photo' | 'preview';

// Landing Page Component
const LandingPage: React.FC<{
  onStartClick: () => void;
}> = ({ onStartClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GM</span>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">GENTLE MONSTER</h1>
        </div>

        {/* Main Content */}
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            AI STUDENT ID CARD
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Gentle Monster's 2024 Optical Collection invites you to dive 
            into the Gentle High School experience. Start your student 
            life at Gentle High School by obtaining your AI student ID.
          </p>

          <button
            onClick={onStartClick}
            className="w-full bg-black text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-gray-900 transition-colors duration-200 mb-8"
          >
            Receive your AI Student ID
          </button>

          {/* Phone Mockup */}
          <div className="relative mx-auto w-48 h-96 bg-black rounded-[2.5rem] p-2 shadow-xl">
            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
              
              {/* Screen Content */}
              <div className="pt-8 px-4 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-32 h-40 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                    <div className="w-24 h-32 bg-gradient-to-b from-orange-200 to-orange-300 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-20 bg-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom UI */}
                <div className="pb-8 flex justify-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Camera Overlay Component - Real Camera + File Upload
const CameraOverlay: React.FC<{
  onBack: () => void;
  onCapture: (photo: string) => void;
}> = ({ onBack, onCapture }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Initialize camera when component mounts
  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      setShowFileUpload(false);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      setIsLoading(false);
      setShowFileUpload(true);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. You can upload a photo instead.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please upload a photo instead.');
        } else {
          setError('Camera unavailable. Please upload a photo instead.');
        }
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera and return the captured image
    stopCamera();
    onCapture(imageData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        stopCamera();
        onCapture(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <div className="text-center text-white p-8 max-w-md">
          <Camera className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-4">Camera Error</h2>
          <p className="mb-6">{error}</p>
          
          <div className="space-y-4">
            <button
              onClick={triggerFileUpload}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              📁 Upload Photo Instead
            </button>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={startCamera}
                className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Try Camera Again
              </button>
              <button
                onClick={onBack}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <div className="relative h-full flex flex-col">
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-4">
            <button onClick={triggerFileUpload} className="w-10 h-10 flex items-center justify-center">
              <span className="text-white text-xl">📁</span>
            </button>
            <button onClick={toggleCamera} className="w-10 h-10 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Camera View */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          {isLoading ? (
            <div className="text-white text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <p>Starting camera...</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-center gap-8">
            <button onClick={triggerFileUpload} className="w-12 h-12 border-2 border-white/50 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white text-lg">📁</span>
            </button>
            
            <button
              onClick={capturePhoto}
              disabled={isLoading}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full"></div>
            </button>

            <button onClick={toggleCamera} className="w-12 h-12 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Page Component
const FeaturePage: React.FC<{
  studentInfo: StudentInfo;
  onInfoChange: (info: Partial<StudentInfo>) => void;
  onCameraClick: () => void;
  onPhotoCapture: (photo: string) => void;
  onDownload: () => void;
  onBack: () => void;
  canDownload: boolean;
}> = ({ studentInfo, onInfoChange, onCameraClick, onPhotoCapture, onDownload, onBack, canDownload }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header matching landing page */}
        <div className="bg-white rounded-3xl shadow-2xl mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GM</span>
                </div>
                <h1 className="text-2xl font-bold text-black">GENTLE MONSTER</h1>
              </div>
              <button onClick={onBack} className="text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Create Your Student ID</h2>
            <p className="text-gray-600 leading-relaxed">
              Fill in your information and take a photo to generate your Gentle High School student ID card.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">Personal Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={studentInfo.name}
                    onChange={(e) => onInfoChange({ name: e.target.value })}
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
                    onChange={(e) => onInfoChange({ birthday: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                  <label htmlFor="birthday" className="absolute -top-2 left-4 text-sm text-black bg-white px-2 rounded font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                </div>
              </div>
            </div>

            {/* Photo Capture */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">Photo Capture</h3>
              </div>
              
              <div className="space-y-6">
                {!studentInfo.photo ? (
                  <div className="relative aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Take or upload your photo</p>
                      <button
                        onClick={onCameraClick}
                        className="bg-black text-white px-8 py-3 rounded-none font-medium hover:bg-gray-900 transition-colors duration-200"
                      >
                        Start Camera
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <img src={studentInfo.photo} alt="Captured photo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onPhotoCapture('')}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Remove
                      </button>
                      <button
                        onClick={onCameraClick}
                        className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* ID Card Preview */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-black mb-6">ID Card Preview</h3>
              
              {/* Gentle Monster Style ID Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 hover:scale-105 transition-transform duration-300 max-w-xs mx-auto">
                <div className="flex h-96">
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mb-6">
                      {studentInfo.photo ? (
                        <img src={studentInfo.photo} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="border-b border-gray-300 pb-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">NAME</div>
                        <div className="text-base font-medium text-gray-800">
                          {studentInfo.name || 'Your Name'}
                        </div>
                      </div>
                      
                      <div className="border-b border-gray-300 pb-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">OPTICAL ID</div>
                        <div className="text-base font-medium text-gray-800">
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
                  
                  <div className="w-16 bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center">
                    <div className="text-white text-xs font-bold transform rotate-90 whitespace-nowrap tracking-wider">
                      GENTLE HIGH SCHOOL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <button
                onClick={onDownload}
                disabled={!canDownload}
                className={`w-full px-6 py-4 rounded-none font-medium text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  canDownload ? 'bg-black hover:bg-gray-900 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-6 h-6" />
                Download ID Card
              </button>
              
              {!canDownload && (
                <p className="text-center text-gray-500 text-sm mt-3">
                  Complete all fields and add a photo to download
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    birthday: '',
    photo: undefined
  });

  const handleInfoChange = (info: Partial<StudentInfo>) => {
    setStudentInfo(prev => ({ ...prev, ...info }));
  };

  const handlePhotoCapture = (photo: string) => {
    setStudentInfo(prev => ({ ...prev, photo: photo || undefined }));
    if (photo) {
      setCurrentView('preview');
    }
  };

  const handleDownload = () => {
    if (!studentInfo.name || !studentInfo.birthday || !studentInfo.photo) {
      alert('Please complete all fields and add a photo before downloading.');
      return;
    }

    // Create high-quality ID card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      };
      img.src = studentInfo.photo;
    } else {
      // Download without photo
      const link = document.createElement('a');
      link.download = `${studentInfo.name.replace(/\s+/g, '_')}_student_id.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Render based on current view
  return (
    <div className="min-h-screen bg-gray-100">
      {(() => {
        switch (currentView) {
    case 'landing':
      return <LandingPage onStartClick={() => setCurrentView('info')} />;
    case 'info':
      return (
        <FeaturePage
          studentInfo={studentInfo}
          onInfoChange={handleInfoChange}
          onCameraClick={() => setCurrentView('photo')}
          onPhotoCapture={handlePhotoCapture}
          onDownload={handleDownload}
          onBack={() => setCurrentView('landing')}
          canDownload={!!(studentInfo.name && studentInfo.birthday && studentInfo.photo)}
        />
      );
    case 'photo':
      return (
        <CameraOverlay
          onBack={() => setCurrentView('info')}
          onCapture={handlePhotoCapture}
        />
      );
    case 'preview':
      return (
        <FeaturePage
          studentInfo={studentInfo}
          onInfoChange={handleInfoChange}
          onCameraClick={() => setCurrentView('photo')}
          onPhotoCapture={handlePhotoCapture}
          onDownload={handleDownload}
          onBack={() => setCurrentView('photo')}
          canDownload={!!(studentInfo.name && studentInfo.birthday && studentInfo.photo)}
        />
      );
    default:
      return <LandingPage onStartClick={() => setCurrentView('info')} />;
        }
      })()}
    </div>
  );

};

export default App;