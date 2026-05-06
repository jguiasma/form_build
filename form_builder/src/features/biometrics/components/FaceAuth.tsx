import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLogBiometricAttempt } from '../hooks/useBiometricApi';

interface FaceAuthProps {
  onCapture: (embedding: number[]) => void;
  mode: 'enroll' | 'verify';
  email?: string;
  onStatusChange?: (status: string) => void;
  onFailure?: (reason: string, attempts: number) => void;
  isVerifying?: boolean;
}

const FaceAuth: React.FC<FaceAuthProps> = ({ onCapture, mode, email, onStatusChange, onFailure, isVerifying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState<'initializing' | 'loading_models' | 'ready' | 'detecting' | 'liveness_check' | 'success' | 'failed'>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const lastBlinkTimeRef = useRef<number>(0);

  // Constants
  const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
  const BLINK_THRESHOLD = 0.25; // Loosened to ease acceptance for real people
  const REQUIRED_BLINKS = 1; // Only 1 blink needed now


  // useEffect(() => {
    // ... same useEffect for loading models ...

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus('loading_models');
        onStatusChange?.('Initializing AI engine...');

        // face-api.js uses tfjs. Initialization of backend webgl can fail on some devices.
        // We try to use WebGL first, but fallback to CPU if it fails.
        try {
          // @ts-ignore - face-api.js re-exports tf
          const tf = faceapi.tf;
          if (tf) {
            await tf.setBackend('webgl').catch(async () => {
              console.warn('WebGL initialization failed, falling back to CPU');
              await tf.setBackend('cpu');
            });
            await tf.ready();
          }
        } catch (e) {
          console.error('TFJS initialization error:', e);
        }
        
        onStatusChange?.('Loading models...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        setStatus('ready');
        onStatusChange?.('Models loaded. Ready to start camera.');
        startVideo();
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Could not load face recognition models. Please check your connection.');
        setStatus('failed');
      }
    };

    loadModels();

    return () => {
      stopCamera();
    };
  }, []);

  const startVideo = async () => {
    // Check for Secure Context / MediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const errorMessage = !isLocalhost 
        ? 'Camera access requires a secure connection (HTTPS). Please access via localhost or use HTTPS.' 
        : 'Your browser does not support camera access or it is disabled.';
      
      setError(errorMessage);
      setStatus('failed');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        challengeIndexRef.current = 0; // Reset challenge on fresh start
        const challenges = ['left', 'right', 'mouth'] as const;
        targetDirectionRef.current = challenges[Math.floor(Math.random() * challenges.length)];
        setLivenessProgress(0);
        setStatus('detecting');
        onStatusChange?.('Detecting face...');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      let msg = 'Could not access camera. Please ensure permissions are granted.';
      if (err.name === 'NotAllowedError') msg = 'Camera permission denied. Please allow access in browser settings.';
      if (err.name === 'NotFoundError') msg = 'No camera found on this device.';
      
      setError(msg);
      setStatus('failed');
    }
  };

  // Blink detection logic (Simplified EAR)
  const getEAR = (eyePoints: faceapi.Point[]) => {
    const v1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2));
    const v2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2));
    const h = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2));
    return (v1 + v2) / (2.0 * h);
  };

  const logMutation = useLogBiometricAttempt();
  const detectionStartTimeRef = useRef<number | null>(null);
  const hasLoggedFailureRef = useRef(false);

  const challengeIndexRef = useRef(0); // 0 = blink, 1 = turn head, 2 = extract
  const targetDirectionRef = useRef<'left' | 'right' | 'mouth'>('left');

  useEffect(() => {
    let animationFrameId: number;
    let isBlinkingNow = false;

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current || status === 'success' || status === 'failed') return;
      
      // Ensure video is playing and has data
      if (videoRef.current.paused || videoRef.current.ended || videoRef.current.readyState < 2) {
        animationFrameId = requestAnimationFrame(detect);
        return;
      }

      if (!detectionStartTimeRef.current) detectionStartTimeRef.current = Date.now();
      const elapsed = Date.now() - detectionStartTimeRef.current;

      // FAST PATH: Only detect landmarks for liveness (NO descriptors)
      const face = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
            inputSize: 160, // Fast
            scoreThreshold: 0.2 // Sensitive
        }))
        .withFaceLandmarks();

      if (face) {
        // Draw landmarks for debug/feedback
        const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
        const resized = faceapi.resizeResults(face, dims);
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        
        const landmarks = face.landmarks;
        const now = Date.now();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        if (challengeIndexRef.current === 0) {
            onStatusChange?.('Face detected. Please BLINK to verify.');
            const ear = (getEAR(leftEye) + getEAR(rightEye)) / 2;

            if (ear < BLINK_THRESHOLD && !isBlinkingNow && (now - lastBlinkTimeRef.current > 500)) {
                isBlinkingNow = true;
                lastBlinkTimeRef.current = now;
                setLivenessProgress(50);
                challengeIndexRef.current = 1;
            } else if (ear > BLINK_THRESHOLD + 0.05) {
                isBlinkingNow = false;
            }
        } else if (challengeIndexRef.current === 1) {
            let passed = false;
            
            if (targetDirectionRef.current === 'mouth') {
                onStatusChange?.('Great! Now OPEN YOUR MOUTH slightly.');
                const mouth = landmarks.getMouth();
                const innerLipDist = mouth[18].y - mouth[14].y;
                const eyeDist = rightEye[0].x - leftEye[3].x;
                
                if (innerLipDist / eyeDist > 0.15) passed = true;
            } else {
                onStatusChange?.(`Great! Now TURN YOUR HEAD slightly to your ${targetDirectionRef.current.toUpperCase()}.`);
                const nose = landmarks.getNose()[3];
                const jaw = landmarks.getJawOutline();
                const distLeft = nose.x - jaw[0].x;
                const distRight = jaw[16].x - nose.x;
                const ratio = distLeft / distRight;
                
                if (targetDirectionRef.current === 'left' && ratio < 0.6) passed = true;
                if (targetDirectionRef.current === 'right' && ratio > 1.6) passed = true;
            }
            
            if (passed) {
                setLivenessProgress(100);
                challengeIndexRef.current = 2;
                onStatusChange?.('Extracting secure identity... Please hold still.');
            }
        } else if (challengeIndexRef.current === 2) {
             // SLOW PATH: We passed liveness, now we need the descriptor for verification
             const fullFace = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

             if (fullFace) {
                 stopCamera();
                 setStatus('success');
                 onStatusChange?.(mode === 'enroll' ? 'Face Captured!' : 'Identity Captured!');
                 const embedding = Array.from(fullFace.descriptor);
                 onCapture(embedding);
                 return;
             }
        }
      } else {
          // No face detected - Clear canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          onStatusChange?.('No face detected. Please look at the camera.');
      }

      if (!hasLoggedFailureRef.current) {
          if (!face && elapsed > 10000) {
              hasLoggedFailureRef.current = true;
              logMutation.mutate({ email, reason: 'No face detected within 10s' }, {
                  onSuccess: (data) => onFailure?.('No face detected', data.attempts)
              });
              stopCamera();
              return; // Stop detection loop
          } else if (face && challengeIndexRef.current < 2 && elapsed > 20000) {
              hasLoggedFailureRef.current = true;
              logMutation.mutate({ email, reason: 'Liveness challenge failed within 20s' }, {
                  onSuccess: (data) => onFailure?.('Liveness check failed', data.attempts)
              });
              stopCamera();
              return; // Stop detection loop
          }
      }

      // We use a tiny delay (10ms) instead of 50ms now because we removed the heavy descriptor extraction!
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(detect);
      }, 10);
    };

    if (modelsLoaded && status === 'detecting') {
      detect();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [modelsLoaded, status]);

  return (
    <div className="relative flex flex-col items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-md mx-auto">
      <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        
        {/* Overlay Overlays */}
        {status === 'loading_models' && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white p-6 text-center">
            <RefreshCw className="w-10 h-10 animate-spin text-blue-400 mb-4" />
            <p className="font-bold">Loading Secure AI Models...</p>
            <p className="text-xs text-slate-400 mt-2">This happens only once per session.</p>
          </div>
        )}

        {status === 'detecting' && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
             <div className="size-2 bg-red-500 animate-pulse rounded-full" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Scanner</span>
          </div>
        )}

        {status === 'success' && !isVerifying && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center text-white">
             <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             <p className="mt-4 font-black text-xl tracking-tight">Verified!</p>
          </div>
        )}

        {isVerifying && (
          <div className="absolute inset-0 bg-[#1148ad]/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
            <RefreshCw className="w-10 h-10 animate-spin text-white mb-4" />
            <p className="font-bold text-lg">Authenticating...</p>
            <p className="text-xs text-blue-100 mt-2">Checking identity against secure records.</p>
          </div>
        )}
      </div>

      <div className="w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">
              {mode === 'enroll' ? 'Face Enrollment' : 'Face Verification'}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Security Level: High
            </p>
          </div>
          <ShieldCheck className={`w-8 h-8 ${status === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
             <p className="text-xs font-bold text-rose-700 leading-relaxed">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Liveness Check (Blink 2-3 times)</span>
                <span>{Math.round(livenessProgress)}%</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                  style={{ width: `${livenessProgress}%` }}
                />
             </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
           By scanning your face, you agree to our <strong>Biometric Privacy Policy</strong>. 
           Images are never stored; only an encrypted mathematical representation is kept.
        </p>
      </div>
    </div>
  );
};

export default FaceAuth;

