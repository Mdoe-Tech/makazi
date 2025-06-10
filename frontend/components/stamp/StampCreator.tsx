'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Save } from 'lucide-react';

interface StampCreatorProps {
  onStampCreated: (stampData: string) => void;
}

export default function StampCreator({ onStampCreated }: StampCreatorProps) {
  const [stampText, setStampText] = useState('AFISA MTENDAJI');
  const [stampColor, setStampColor] = useState('#FF0000');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasStamp, setHasStamp] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up canvas
    canvas.width = 300;
    canvas.height = 300;

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw text
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = stampColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text in a circle
    const text = stampText.toUpperCase();
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    const angleStep = (2 * Math.PI) / text.length;

    for (let i = 0; i < text.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Draw center text
    ctx.font = 'bold 24px Arial';
    ctx.fillText('APPROVED', 150, 130);

    // Draw date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    ctx.font = 'bold 18px Arial';
    ctx.fillText(dateStr, 150, 170);
  };

  useEffect(() => {
    drawStamp();
  }, [stampText, stampColor]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStampText(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStampColor(e.target.value);
  };

  const saveStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stampData = canvas.toDataURL();
    onStampCreated(stampData);
    setHasStamp(true);
  };

  const downloadStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'stamp.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Stamp Text</label>
          <Input
            value={stampText}
            onChange={handleTextChange}
            placeholder="Enter stamp text"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Stamp Color</label>
          <Input
            type="color"
            value={stampColor}
            onChange={handleColorChange}
            className="h-10"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-64 border rounded-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={downloadStamp}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          onClick={saveStamp}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {hasStamp ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
} 