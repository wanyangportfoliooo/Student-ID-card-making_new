import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, RefreshCw, Check, X } from 'lucide-react';

const PhotoCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraKey, setCameraKey] = useState(0);

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);


  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setIsLoading(true);
      setError('');

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Stop any existing stream
      if (streamRef.current) {
        console.log('Stopping existing stream...');
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Request camera access
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode
        }
      });

      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;

      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().then(() => {
            console.log('Video playing successfully');
            setIsLoading(false);
          }).catch((playErr) => {
            console.error('Video play error:', playErr);
            setIsLoading(false);
          });
        };
      } else {
        setIsLoading(false);
      }

      console.log('Camera started successfully');
    } catch (err) {
      console.error('Camera error:', err);
      setIsLoading(false);
      
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
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      streamRef.current = null;
    }
    // 清除 video 元素的 srcObject
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // 強制重新載入 video 元素
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
    
    // Show preview instead of navigating immediately
    setCapturedImage(imageData);
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
        setCapturedImage(result);
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

  const handleBack = () => {
    navigate('/LandingPage');
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      sessionStorage.setItem('capturedPhoto', capturedImage);
      navigate('/PersonalInformation');
    }
  };

  const retakePhoto = async () => {
    console.log('Retaking photo - returning to initial state...');
    // 強制停止相機
    stopCamera();
    // 清除預覽圖片
    setCapturedImage(null);
    // 重置錯誤狀態
    setError('');
    // 強制重新渲染相機組件
    setCameraKey(prev => prev + 1);
    // 重新啟動相機，回到初始狀態
    setTimeout(() => {
      console.log('Restarting camera - back to initial photo capture state...');
      startCamera();
    }, 300);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-pink-50 rounded-3xl shadow-2xl overflow-hidden">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
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
            <Camera className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-pink-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-800 mb-4">Camera Error</h2>
            <p className="text-pink-600 mb-8 leading-relaxed">{error}</p>
            
            <div className="space-y-4">
              <button
                onClick={triggerFileUpload}
                className="w-full bg-pink-500 text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-pink-600 transition-colors duration-200"
              >
                📁 從相簿選擇
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={startCamera}
                  className="flex-1 bg-pink-200 text-pink-800 py-3 px-4 rounded-xl font-medium hover:bg-pink-300 transition-colors duration-200"
                >
                  重試
                </button>
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-pink-50 rounded-3xl shadow-2xl overflow-hidden">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
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
            PHOTO CAPTURE
          </h2>
          
          <p className="text-pink-600 mb-8 leading-relaxed">
            Take a photo or upload an image for your student ID card.
          </p>

          {/* Camera View or Photo Preview */}
          <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden mb-8">
            {capturedImage ? (
              // Photo Preview Mode
              <div className="relative w-full h-full">
                <img 
                  src={capturedImage} 
                  alt="Captured photo" 
                  className="w-full h-full object-cover"
                />
                {/* Preview Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={retakePhoto} 
                    className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-600/80 transition-colors"
                    aria-label="Cancel and retake photo"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                {/* Preview Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button 
                    onClick={retakePhoto}
                    className="flex-1 bg-pink-200/80 text-pink-800 py-2 px-4 rounded-lg font-medium hover:bg-pink-300/80 transition-colors"
                  >
                    重新拍攝
                  </button>
                  <button 
                    onClick={confirmPhoto}
                    className="flex-1 bg-green-600/80 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700/80 transition-colors"
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    確認
                  </button>
                </div>
              </div>
            ) : (
              // Camera Mode
              <>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 animate-pulse" />
                      <p className="text-sm sm:text-base">Starting camera...</p>
                    </div>
                  </div>
                ) : (
                  <video
                    key={cameraKey}
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ WebkitPlaysinline: 'true' } as React.CSSProperties}
                  />
                )}
                
                {/* Camera Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={triggerFileUpload} 
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                    aria-label="Upload photo from file"
                  >
                    <span className="text-white text-sm">📁</span>
                  </button>
                  <button 
                    onClick={toggleCamera} 
                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                    aria-label="Switch camera (front/back)"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons - Only show when not in preview mode */}
          {!capturedImage && (
            <div className="space-y-4">
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="w-full bg-pink-500 text-white py-4 px-6 rounded-none font-medium text-lg hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? '啟動相機中...' : '拍照'}
              </button>
              
              <button
                onClick={triggerFileUpload}
                className="w-full bg-pink-200 text-pink-800 py-3 px-6 rounded-xl font-medium hover:bg-pink-300 transition-colors duration-200"
              >
                📁 從相簿選擇
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCapturePage;
