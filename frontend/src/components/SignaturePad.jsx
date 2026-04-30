// Importations des dépendances React
import React, { useRef, useEffect, useState } from 'react';

// Composant pour capturer une signature numérique
const SignaturePad = ({ onSignatureSave, disabled = false }) => {
  // Référence pour accéder à l'élément canvas où dessiner
  const canvasRef = useRef(null);
  
  // États pour gérer le dessin
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialiser le canvas au chargement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Obtenir le contexte 2D pour dessiner
      const context = canvas.getContext('2d');
      
      // Remplir le canvas de blanc
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Configurer les paramètres de dessin (couleur, épaisseur, etc.)
      context.strokeStyle = '#000000';
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, []);

  // Fonction appelée au début du dessin (clic ou toucher)
  const startDrawing = (e) => {
    if (disabled) return;
    
    // Activer le mode dessin
    setIsDrawing(true);
    setIsEmpty(false);
    
    // Récupérer la position du clic/toucher
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Démarrer un nouveau trait
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  // Fonction appelée pendant le dessin (mouvements de la souris/doigt)
  const draw = (e) => {
    // Ne dessiner que si on est en train de dessiner et non désactivé
    if (!isDrawing || disabled) return;

    // Récupérer la position actuelle du curseur/doigt
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Continuer le trait jusqu'à la nouvelle position
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  // Fonction appelée quand on arrête de dessiner
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Fonction pour effacer la signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Remplir le canvas de blanc pour effacer
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Marquer comme vide
    setIsEmpty(true);
  };

  // Fonction pour sauvegarder la signature
  const saveSignature = () => {
    if (isEmpty) {
      alert('Veuillez signer avant de continuer');
      return;
    }

    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onSignatureSave(signatureData);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={500}
          height={250}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          disabled={disabled}
          className={`w-full block ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}`}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearSignature}
          disabled={disabled || isEmpty}
          className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition"
        >
          Effacer
        </button>
        <button
          onClick={saveSignature}
          disabled={disabled || isEmpty}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition"
        >
          Valider la signature
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Signez avec votre souris ou votre doigt sur l'écran tactile
      </p>
    </div>
  );
};

export default SignaturePad;
