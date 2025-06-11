'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { colors } from '@/lib/theme/colors';

export default function CitizenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Welcome to Citizen Portal</h3>
        <p className="text-sm text-muted-foreground">
          Access your documents and manage your profile.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Request and manage your official documents.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>View Documents</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>View Profile</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 