'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Save } from 'lucide-react';

interface SignaturePadProps {
  onSignatureCreated: (signatureData: string) => void;
}

export default function SignaturePad({ onSignatureCreated }: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const clearSignature = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
    onSignatureCreated('');
  };

  const saveSignature = () => {
    if (signatureRef.current?.isEmpty()) {
      return;
    }
    const signatureData = signatureRef.current?.toDataURL() || '';
    onSignatureCreated(signatureData);
    setHasSignature(true);
  };

  const downloadSignature = () => {
    if (signatureRef.current?.isEmpty()) {
      return;
    }
    const signatureData = signatureRef.current?.toDataURL() || '';
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = signatureData;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border rounded-lg p-4 bg-white"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      >
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: 'w-full h-48 border rounded-lg',
            style: { touchAction: 'none' }
          }}
          backgroundColor="white"
          penColor="black"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={clearSignature}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
        <Button
          variant="outline"
          onClick={downloadSignature}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          onClick={saveSignature}
          className="flex items-center gap-2"
          disabled={signatureRef.current?.isEmpty()}
        >
          <Save className="w-4 h-4" />
          {hasSignature ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
} 