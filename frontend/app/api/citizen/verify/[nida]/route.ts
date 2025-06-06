import { NextResponse } from 'next/server';
import { verifyNida } from '@/lib/api/citizen/service';

export async function GET(
  request: Request,
  { params }: { params: { nida: string } }
) {
  try {
    const nidaNumber = params.nida;
    
    // Verify NIDA number
    const verificationResult = await verifyNida(nidaNumber);
    
    return NextResponse.json(verificationResult);
  } catch (error: any) {
    console.error('NIDA verification failed:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to verify NIDA number' },
      { status: 400 }
    );
  }
} 