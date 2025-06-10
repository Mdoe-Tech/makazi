'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { nidaService } from '@/lib/api/nida/service';
import type { NidaData } from '@/lib/api/nida/types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface NidaListResponse {
  data: NidaData[];
  total: number;
}

export default function NidaInfoPage() {
  const [nidaData, setNidaData] = useState<NidaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNidaData();
  }, []);

  const fetchNidaData = async () => {
    try {
      const response = await nidaService.getNidaData({ page: 1, limit: 100 }) as unknown as ApiResponse<NidaListResponse>;
      setNidaData(response.data.data);
    } catch (error) {
      console.error('Error fetching NIDA data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">NIDA Information</h1>

        <Card>
          <CardHeader>
            <CardTitle>NIDA Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIDA Number</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nidaData.map((nida) => (
                    <TableRow key={nida.nida_number}>
                      <TableCell>{nida.nida_number}</TableCell>
                      <TableCell>
                        {`${nida.first_name} ${nida.middle_name ? nida.middle_name + ' ' : ''}${nida.last_name}`}
                      </TableCell>
                      <TableCell>{nida.gender}</TableCell>
                      <TableCell>{new Date(nida.date_of_birth).toLocaleDateString()}</TableCell>
                      <TableCell>{nida.phone_number || 'N/A'}</TableCell>
                      <TableCell>{nida.current_residence_region}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={nida.is_verified ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}
                        >
                          {nida.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(nida.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 