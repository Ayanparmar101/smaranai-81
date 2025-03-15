
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Class 8 English chapters data
export const books = [
  {
    id: "honeydew",
    name: "Honeydew",
    chapters: [
      { id: "chapter1", name: "Chapter 1. The Best Christmas Present in the World" },
      { id: "chapter2", name: "Chapter 2. The Tsunami" },
      { id: "chapter3", name: "Chapter 3. Glimpses of the Past" },
      { id: "chapter4", name: "Chapter 4. Bepin Choudhury's Lapse of Memory" },
      { id: "chapter5", name: "Chapter 5. The Summit Within" },
      { id: "chapter6", name: "Chapter 6. This is Jody's Faun" },
      { id: "chapter7", name: "Chapter 7. A Visit to Cambridge" },
      { id: "chapter8", name: "Chapter 8. A Short Monsoon Diary" }
    ]
  },
  {
    id: "it-so-happened",
    name: "It So Happened",
    chapters: [
      { id: "chapter1", name: "Chapter 1. How the Camel got his hump" },
      { id: "chapter2", name: "Chapter 2. Children at work" },
      { id: "chapter3", name: "Chapter 3. The Selfish Giant" },
      { id: "chapter4", name: "Chapter 4. The Treasure within" },
      { id: "chapter5", name: "Chapter 5. Princess September" },
      { id: "chapter6", name: "Chapter 6. The Fight" },
      { id: "chapter7", name: "Chapter 7. Jalebis" },
      { id: "chapter8", name: "Chapter 8. Ancient Education System of India" }
    ]
  }
];

export const classOptions = Array.from({ length: 8 }, (_, i) => ({ value: (i + 1).toString(), label: `Class ${i + 1}` }));

interface ChapterSelectorProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedBook: string;
  setSelectedBook: (value: string) => void;
  selectedChapter: string;
  setSelectedChapter: (value: string) => void;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  selectedClass,
  setSelectedClass,
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="class-select">Select Class</Label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger id="class-select">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="book-select">Select Book</Label>
        <Select value={selectedBook} onValueChange={setSelectedBook}>
          <SelectTrigger id="book-select">
            <SelectValue placeholder="Select Book" />
          </SelectTrigger>
          <SelectContent>
            {books.map(book => (
              <SelectItem key={book.id} value={book.id}>
                {book.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="chapter-select">Select Chapter</Label>
        <Select 
          value={selectedChapter} 
          onValueChange={setSelectedChapter}
          disabled={!selectedBook}
        >
          <SelectTrigger id="chapter-select">
            <SelectValue placeholder="Select Chapter" />
          </SelectTrigger>
          <SelectContent>
            {books.find(b => b.id === selectedBook)?.chapters.map(chapter => (
              <SelectItem key={chapter.id} value={chapter.id}>
                {chapter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChapterSelector;
