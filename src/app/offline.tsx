'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff, Home } from "lucide-react";

export default function Offline() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <WifiOff className="h-16 w-16 text-primary opacity-75" />
          </div>
          <CardTitle className="text-2xl text-center text-primary">You&apos;re Offline</CardTitle>
          <CardDescription className="text-center">
            It looks like you&apos;re currently offline. Some features may not be available.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 