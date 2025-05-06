/**
 * Utility functions for managing last read state
 */

interface LastReadState {
  chapterId: string;
  vatNo: string;
  vatFile: string;
}

/**
 * Retrieves the last read state from localStorage
 */
export function getLastReadState(): LastReadState | null {
  if (typeof window === 'undefined') return null;
  
  const chapterId = localStorage.getItem('lastVisitedChapter');
  const vatNo = localStorage.getItem('lastVisitedVat');
  const vatFile = localStorage.getItem('lastVisitedVatFile');
  
  if (!chapterId || !vatNo || !vatFile) return null;
  
  return {
    chapterId,
    vatNo,
    vatFile
  };
}

/**
 * Saves the current read state to localStorage
 */
export function saveLastReadState(chapterId: string, vatNo: string, vatFile: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('lastVisitedChapter', chapterId);
  localStorage.setItem('lastVisitedVat', vatNo);
  localStorage.setItem('lastVisitedVatFile', vatFile);
}

/**
 * Clears the last read state
 */
export function clearLastReadState(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('lastVisitedChapter');
  localStorage.removeItem('lastVisitedVat');
  localStorage.removeItem('lastVisitedVatFile');
} 