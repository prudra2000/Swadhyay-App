"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, ChevronDown, ChevronUp, BookmarkIcon } from "lucide-react";
import { getLastReadState } from "@/lib/last-read";

interface VatData {
  ChId: number;
  RefFile: string | null;
  VatFile: string;
  VatId: number;
  VatName: string;
  VatNameGuj: string;
  VatNo: number;
}

interface ChapterData {
  id: number;
  vats: VatData[];
}

export default function Home() {
  const router = useRouter();
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasLastRead, setHasLastRead] = useState(false);
  const [lastRead, setLastRead] = useState<{ chapterId: string; vatNo: string; vatFile: string } | null>(null);
  
  // Reference to the last read vat element for scrolling
  const lastReadVatRef = useRef<HTMLDivElement>(null);

  // Check for last read position
  useEffect(() => {
    const lastReadState = getLastReadState();
    if (lastReadState) {
      setLastRead(lastReadState);
      setHasLastRead(true);
      
      // Auto-expand ONLY the chapter containing the last read vat
      const chapterIdNum = parseInt(lastReadState.chapterId);
      if (!isNaN(chapterIdNum)) {
        setExpandedChapters(new Set([chapterIdNum])); // Replace previous set entirely
      }
    }
  }, []);
  
  // Scroll to the last read vat when data is loaded and component is mounted
  useEffect(() => {
    if (!isLoading && lastRead && lastReadVatRef.current) {
      // Add a slight delay to ensure DOM is fully rendered
      setTimeout(() => {
        lastReadVatRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 500);
    }
  }, [isLoading, lastRead]);

  // Load vat data
  useEffect(() => {
    // Load vat data from public folder
    const loadVatData = async () => {
      try {
        const response = await fetch("/vato.json");
        if (!response.ok) {
          throw new Error("Failed to load vat data");
        }

        const data = await response.json();

        // Process the data and organize by chapters
        const chapterMap = new Map<number, VatData[]>();

        data.forEach((item: VatData) => {
          const chapter = item.ChId || 1;
          if (!chapterMap.has(chapter)) {
            chapterMap.set(chapter, []);
          }
          chapterMap.get(chapter)?.push(item);
        });

        // Convert map to array
        const chaptersArray: ChapterData[] = [];
        chapterMap.forEach((vats, id) => {
          chaptersArray.push({ id, vats });
        });

        // Sort chapters by ID
        chaptersArray.sort((a, b) => a.id - b.id);

        setChapters(chaptersArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading vat data:", error);
        setIsLoading(false);
      }
    };

    loadVatData();
  }, []);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const navigateToLastRead = () => {
    if (lastRead) {
      router.push(`/chapter/${lastRead.chapterId}/${lastRead.vatFile}`);
    }
  };

  // Modify the vat card rendering inside the chapter mapping to add a ref to the last read vat
  const isLastReadVat = (chapter: ChapterData, vat: VatData) => {
    return (
      lastRead &&
      chapter.id.toString() === lastRead.chapterId &&
      vat.VatNo.toString() === lastRead.vatNo
    );
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="mb-8 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">
            Swamini Vato
          </CardTitle>
          <div className="w-20 h-1 bg-primary mx-auto my-2 rounded-full"></div>
          <CardDescription className="text-3xl font-semibold text-primary">
            સ્વામિની વાતો
          </CardDescription>
        </CardHeader>
      </Card>

      {hasLastRead && (
        <Card className="mb-6 border-primary/30 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookmarkIcon className="h-5 w-5 text-primary" />
              Continue Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Prakaran {lastRead?.chapterId} - Vat {lastRead?.vatNo}
              </p>
              <Button 
                variant="default" 
                size="sm" 
                onClick={navigateToLastRead}
                className="bg-primary hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {chapters.map((chapter) => (
          <Card
            key={chapter.id}
            className="overflow-hidden border-primary/20 hover:border-primary/30 transition-all"
          >
            <div
              className="w-full flex justify-between items-center bg-secondary/50 text-lg px-6 py-3 cursor-pointer group transition-colors hover:bg-secondary"
              onClick={() => toggleChapter(chapter.id)}
            >
              <div className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5 text-primary" />
                <Link href={`/chapter/${chapter.id}`} className="font-semibold text-primary hover:underline">
                  Prakaran {chapter.id}
                </Link>
              </div>
              <span className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {expandedChapters.has(chapter.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </span>
            </div>
            
            {expandedChapters.has(chapter.id) && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {chapter.vats.map((vat) => {
                    const htmlFile = vat.VatFile.replace(".txt", ".html");
                    const isCurrentLastRead = isLastReadVat(chapter, vat);
                    
                    return (
                      <div
                        key={vat.VatId}
                        ref={isCurrentLastRead ? lastReadVatRef : null}
                        className={`${isCurrentLastRead ? '' : ''}`}
                      >
                        <Link 
                          href={`/chapter/${chapter.id}/${htmlFile}`}
                          className="block"
                        >
                          <Card className={`h-full border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 ${isCurrentLastRead ? 'bg-secondary/20 ring-2 ring-primary/60 rounded-2xl border-primary/60' : ''}`}>
                            <CardHeader className="flex flex-row justify-between items-center">
                              <div className="flex items-center gap-2">
                                {isCurrentLastRead && (
                                  <BookmarkIcon className="h-4 w-4 text-primary" />
                                )}
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
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
