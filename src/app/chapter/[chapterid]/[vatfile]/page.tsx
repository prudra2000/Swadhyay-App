'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, ArrowLeftIcon, ArrowRightIcon, RotateCwIcon, Slash, BookOpenText } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { saveLastReadState } from "@/lib/last-read";

interface VatData {
  ChId: number;
  RefFile: string | null;
  VatFile: string;
  VatId: number;
  VatName: string;
  VatNameGuj: string;
  VatNo: number;
}

export default function VatPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterid as string;
  const vatFile = params.vatfile as string;
  
  const [transliteratedText, setTransliteratedText] = useState<string>('');
  const [gujaratiText, setGujaratiText] = useState<string>('');
  const [vatData, setVatData] = useState<VatData[]>([]);
  const [currentVat, setCurrentVat] = useState<VatData | null>(null);
  const [showingIAST, setShowingIAST] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load vat data and content
  useEffect(() => {
    const loadContent = async () => {
      try {
        // First, load the vato.json file to get metadata
        const response = await fetch('/vato.json');
        if (!response.ok) {
          throw new Error('Failed to load vat data');
        }
        
        const data = await response.json();
        setVatData(data);
        
        // Find current vat data - need to convert html filename back to txt for comparison
        const txtFile = vatFile.replace('.html', '.txt');
        const current = data.find((vat: VatData) => 
          vat.ChId.toString() === chapterId && vat.VatFile === txtFile
        );
        
        setCurrentVat(current || null);
        
        // Now, fetch the HTML content from the output_html folder
        const htmlPath = `/output_html/chapter${chapterId}/${vatFile}`;
        const htmlResponse = await fetch(htmlPath);
        
        if (!htmlResponse.ok) {
          throw new Error(`Failed to load vat content from ${htmlPath}`);
        }
        
        const htmlContent = await htmlResponse.text();
        
        // Extract transliterated and Gujarati text using regex
        const iastMatch = htmlContent.match(/<div id="iastBlock">\s*<pre>([\s\S]*?)<\/pre>\s*<\/div>/);
        const gujaratiMatch = htmlContent.match(/<div id="gujaratiBlock"[^>]*>\s*<pre>([\s\S]*?)<\/pre>\s*<\/div>/);
        
        if (iastMatch && iastMatch[1]) {
          setTransliteratedText(iastMatch[1]);
        }
        
        if (gujaratiMatch && gujaratiMatch[1]) {
          setGujaratiText(gujaratiMatch[1]);
        }
        
        // Store position using our utility function
        if (current) {
          saveLastReadState(
            chapterId, 
            current.VatNo.toString(), 
            vatFile
          );
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [chapterId, vatFile]);
  
  const toggleText = () => {
    setShowingIAST(prev => !prev);
  };
  
  // Calculate previous and next vat navigation
  const findAdjacentVat = (direction: 'prev' | 'next') => {
    if (!currentVat || !vatData.length) return null;
    
    // Filter vats from the same chapter
    const chapterVats = vatData.filter(vat => vat.ChId.toString() === chapterId);
    
    // Sort by vat number
    chapterVats.sort((a, b) => a.VatNo - b.VatNo);
    
    // Find the current vat's index in the sorted array
    const txtFile = vatFile.replace('.html', '.txt');
    const currentIndex = chapterVats.findIndex(vat => vat.VatFile === txtFile);
    
    if (currentIndex === -1) return null;
    
    if (direction === 'prev') {
      // Get previous vat or move to the last vat of the previous chapter
      if (currentIndex > 0) {
        return chapterVats[currentIndex - 1];
      } else {
        // Find vats from the previous chapter
        const prevChapterId = parseInt(chapterId) - 1;
        if (prevChapterId < 1) return null; // No previous chapter
        
        const prevChapterVats = vatData.filter(vat => vat.ChId === prevChapterId);
        if (!prevChapterVats.length) return null;
        
        prevChapterVats.sort((a, b) => a.VatNo - b.VatNo);
        return prevChapterVats[prevChapterVats.length - 1]; // Last vat of previous chapter
      }
    } else {
      // Get next vat or move to the first vat of the next chapter
      if (currentIndex < chapterVats.length - 1) {
        return chapterVats[currentIndex + 1];
      } else {
        // Find vats from the next chapter
        const nextChapterId = parseInt(chapterId) + 1;
        const nextChapterVats = vatData.filter(vat => vat.ChId === nextChapterId);
        if (!nextChapterVats.length) return null;
        
        nextChapterVats.sort((a, b) => a.VatNo - b.VatNo);
        return nextChapterVats[0]; // First vat of next chapter
      }
    }
  };
  
  const prevVat = findAdjacentVat('prev');
  const nextVat = findAdjacentVat('next');
  
  const navigateTo = (vat: VatData | null) => {
    if (!vat) return;
    // Convert the .txt filename to .html for navigation
    const htmlFile = vat.VatFile.replace('.txt', '.html');
    router.push(`/chapter/${vat.ChId}/${htmlFile}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 max-w-4xl flex flex-col min-h-screen pb-20 pt-4">
      {currentVat && (
        <Card className="mb-6">
          <CardHeader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="hover:text-primary text-primary inline-flex items-center gap-2">
                      <HomeIcon className="h-4 w-4 mr-1 inline" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/chapter/${chapterId}`} className="hover:text-primary inline-flex items-center gap-2">
                      <BookOpenText className="h-4 w-4" />
                      Prakaran {chapterId}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <Badge variant="outline" className="ml-0">Vat {currentVat.VatNo}</Badge>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <CardTitle className="text-2xl text-primary break-words">{currentVat.VatName}</CardTitle>
            <CardDescription className="text-lg font-gujarati break-words">
              {currentVat.VatNameGuj}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <Card className="mb-6 flex-grow">
        <CardContent className="p-6">
          <div id="iastBlock" className={showingIAST ? '' : 'hidden'}>
            <pre className="whitespace-pre-wrap break-words font-['Noto_Sans_Gujarati',_Arial,_sans-serif] text-lg leading-relaxed">{transliteratedText}</pre>
          </div>
          
          <div id="gujaratiBlock" className={showingIAST ? 'hidden' : ''}>
            <pre className="whitespace-pre-wrap break-words font-['Noto_Sans_Gujarati',_Arial,_sans-serif] text-lg leading-relaxed">{gujaratiText}</pre>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={toggleText}
              variant="outline"
              className="gap-2"
            >
              <RotateCwIcon className="h-4 w-4" />
              {showingIAST ? 'Show Gujarati' : 'Show Transliteration'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-4 left-0 right-0 px-4 z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center rounded-xl border py-4 px-6 shadow-md bg-card">
          <Button 
            variant="link"
            className="gap-1"
            onClick={() => navigateTo(prevVat)}
            disabled={!prevVat}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          
          <Button asChild >
            <Link href="/">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </Link>
          </Button>
          
          <Button 
            variant="link"
            className="gap-1"
            onClick={() => navigateTo(nextVat)}
            disabled={!nextVat}
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
    </div>
  );
} 