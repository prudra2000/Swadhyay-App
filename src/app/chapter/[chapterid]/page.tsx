'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, BookOpenText, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface VatData {
  ChId: number;
  RefFile: string | null;
  VatFile: string;
  VatId: number;
  VatName: string;
  VatNameGuj: string;
  VatNo: number;
}

export default function ChapterPage() {
  const params = useParams();
  const chapterId = params.chapterid as string;
  
  const [vats, setVats] = useState<VatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadVats = async () => {
      try {
        const response = await fetch('/vato.json');
        if (!response.ok) {
          throw new Error('Failed to load vat data');
        }
        
        const data = await response.json();
        
        // Filter vats for the current chapter
        const chapterVats = data.filter((vat: VatData) => vat.ChId.toString() === chapterId);
        
        // Sort by vat number
        chapterVats.sort((a: VatData, b: VatData) => a.VatNo - b.VatNo);
        
        setVats(chapterVats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading vat data:', error);
        setIsLoading(false);
      }
    };
    
    loadVats();
  }, [chapterId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 max-w-4xl py-6">
      <Card className="mb-6">
        <CardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="hover:text-primary text-primary inline-flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="inline-flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" />
                  Prakaran {chapterId}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CardTitle className="text-2xl text-primary">Prakaran {chapterId}</CardTitle>
          <CardDescription className="text-lg">
            All vats in Chapter {chapterId}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {vats.map((vat) => {
          const htmlFile = vat.VatFile.replace('.txt', '.html');
          
          return (
            <Link 
              href={`/chapter/${chapterId}/${htmlFile}`}
              key={vat.VatId}
              className="block"
            >
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-foreground">{vat.VatName}</CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit border-accent text-accent font-medium bg-secondary/50">
                    Vat {vat.VatNo}
                  </Badge>
                </CardHeader>
                <CardFooter className="text-xs text-muted-foreground font-gujarati bg-card">
                  {vat.VatNameGuj}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 