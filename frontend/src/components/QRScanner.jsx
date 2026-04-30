import React, { useEffect, useRef, useState } from 'react';

const QRScanner = ({ onScan, disabled = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (disabled || !isScanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Commencer à scanner
        scanQRCode();
      } catch (err) {
        // Gérer l'erreur si la caméra n'est pas disponible
        setError('Impossible d\'accéder à la caméra: ' + err.message);
        setHasCamera(false);
      }
    };

    // Lancer l'initialisation de la caméra
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [disabled, isScanning]);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          // Utilisez une bibliothèque QR code comme jsQR
          // Pour ce prototype, on simule un scan
          // En production, intégrer jsQR ou zxing
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Simuler la détection d'un QR code
          // Remplacer par la vraie logique de scan
          
        } catch (err) {
          // Erreur lors du scan, continuer
        }
      }
    }, 100);

    return () => clearInterval(scanInterval);
  };

  const handleManualInput = (e) => {
    const token = e.target.value;
    if (token && token.length > 10) {
      onScan(token);
      e.target.value = '';
    }
  };

  if (!hasCamera) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <p className="text-yellow-700">
          Caméra non disponible. Entrez le token manuellement:
        </p>
        <input
          type="text"
          placeholder="Entrez le token QR"
          onChange={handleManualInput}
          className="mt-2 px-4 py-2 border border-yellow-300 rounded-lg w-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-80 object-cover"
          autoPlay
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg">Scanner désactivé</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isScanning ? 'Arrêter' : 'Commencer'} le scan
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 Conseil: Pointez la caméra vers le code QR du créneau pour enregistrer votre présence.
        </p>
        <input
          type="text"
          placeholder="Ou collez le token ici"
          onPaste={(e) => {
            const token = e.clipboardData.getData('text');
            if (token) {
              onScan(token);
            }
          }}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>
    </div>
  );
};

export default QRScanner;
