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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Loader2, 
  Search, 
  UserPlus, 
  FileText, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { nidaService } from '@/lib/api/nida/service';
import type { NidaData } from '@/lib/api/nida/types';
import { useRouter } from 'next/navigation';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface NidaListResponse {
  data: NidaData[];
  total: number;
}

export default function NidaInfoPage() {
  const router = useRouter();
  const [nidaData, setNidaData] = useState<NidaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof NidaData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (field: keyof NidaData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = nidaData
    .filter(nida => 
      nida.nida_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${nida.first_name} ${nida.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nida.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">NIDA Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage and verify National ID records
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/nida/register')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register New NIDA
        </Button>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              NIDA Records
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search NIDA records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px] border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border border-slate-200 dark:border-slate-800">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] border border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-slate-200 dark:border-slate-800" />
                  <DropdownMenuItem>All Records</DropdownMenuItem>
                  <DropdownMenuItem>Verified Only</DropdownMenuItem>
                  <DropdownMenuItem>Pending Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800"
                      onClick={() => handleSort('nida_number')}
                    >
                      <div className="flex items-center gap-2">
                        NIDA Number
                        <ArrowUpDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800"
                      onClick={() => handleSort('first_name')}
                    >
                      <div className="flex items-center gap-2">
                        Full Name
                        <ArrowUpDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </TableHead>
                    <TableHead className="border-r border-slate-200 dark:border-slate-800">Gender</TableHead>
                    <TableHead className="border-r border-slate-200 dark:border-slate-800">Date of Birth</TableHead>
                    <TableHead className="border-r border-slate-200 dark:border-slate-800">Phone</TableHead>
                    <TableHead className="border-r border-slate-200 dark:border-slate-800">Region</TableHead>
                    <TableHead className="border-r border-slate-200 dark:border-slate-800">Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-2">
                        Registration Date
                        <ArrowUpDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((nida) => (
                    <TableRow 
                      key={nida.nida_number}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-50 border-r border-slate-200 dark:border-slate-800">
                        {nida.nida_number}
                      </TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {`${nida.first_name} ${nida.middle_name ? nida.middle_name + ' ' : ''}${nida.last_name}`}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {nida.phone_number || 'No phone'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">{nida.gender}</TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">{new Date(nida.date_of_birth).toLocaleDateString()}</TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">{nida.phone_number || 'N/A'}</TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">{nida.current_residence_region}</TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">
                        <Badge
                          variant="outline"
                          className={
                            nida.is_verified
                              ? 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400'
                              : 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400'
                          }
                        >
                          {nida.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="border-r border-slate-200 dark:border-slate-800">
                        {new Date(nida.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border border-slate-200 dark:border-slate-800">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="border-slate-200 dark:border-slate-800" />
                            <DropdownMenuItem onClick={() => router.push(`/admin/nida/${nida.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/nida/${nida.id}/edit`)}>
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-slate-200 dark:border-slate-800" />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 