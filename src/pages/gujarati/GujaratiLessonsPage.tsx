
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GujaratiLessonsPage = () => {
  const [activeChapter, setActiveChapter] = useState('chapter1');

  const lessons = [
    {
      id: 'chapter1',
      title: 'પ્રથમ પાઠ: ગુજરાતી મૂળાક્ષરો',
      englishTitle: 'Chapter 1: Gujarati Alphabet',
      sections: [
        {
          title: 'સ્વર (Vowels)',
          content: 'ગુજરાતી ભાષામાં 11 સ્વર છે: અ, આ, ઇ, ઈ, ઉ, ઊ, ઋ, એ, ઐ, ઓ, ઔ',
          english: 'There are 11 vowels in Gujarati: a, aa, i, ee, u, oo, ru, e, ai, o, au'
        },
        {
          title: 'વ્યંજન (Consonants)',
          content: 'ગુજરાતી ભાષામાં 34 વ્યંજન છે: ક, ખ, ગ, ઘ, ચ, છ, જ, ઝ...',
          english: 'There are 34 consonants in Gujarati: ka, kha, ga, gha, cha, chha, ja, jha...'
        },
        {
          title: 'અભ્યાસ (Practice)',
          content: 'સ્વર અને વ્યંજનનું ઉચ્ચારણ પ્રેક્ટિસ કરો.',
          english: 'Practice pronouncing vowels and consonants.'
        }
      ]
    },
    {
      id: 'chapter2',
      title: 'બીજો પાઠ: ગુજરાતી શબ્દો',
      englishTitle: 'Chapter 2: Gujarati Words',
      sections: [
        {
          title: 'અભિવાદન (Greetings)',
          content: 'નમસ્તે - Hello/Namaste\nકેમ છો? - How are you?\nસારું છું - I am fine',
          english: 'Basic greetings in Gujarati language'
        },
        {
          title: 'સંખ્યાઓ (Numbers)',
          content: 'એક - 1, બે - 2, ત્રણ - 3, ચાર - 4, પાંચ - 5',
          english: 'Counting numbers in Gujarati'
        },
        {
          title: 'રંગો (Colors)',
          content: 'લાલ - Red, પીળો - Yellow, વાદળી - Blue, લીલો - Green',
          english: 'Colors in Gujarati language'
        }
      ]
    },
    {
      id: 'chapter3',
      title: 'ત્રીજો પાઠ: સરળ વાક્યો',
      englishTitle: 'Chapter 3: Simple Sentences',
      sections: [
        {
          title: 'પરિચય (Introduction)',
          content: 'મારું નામ ___ છે. - My name is ___.\nહું ___ થી આવું છું. - I am from ___.',
          english: 'How to introduce yourself in Gujarati'
        },
        {
          title: 'રોજિંદા વાક્યો (Daily sentences)',
          content: 'તમને મળીને આનંદ થયો. - Nice to meet you.\nઆવજો - Goodbye.',
          english: 'Common phrases used in daily conversations'
        },
        {
          title: 'પ્રશ્નો (Questions)',
          content: 'તમારું નામ શું છે? - What is your name?\nતમે ક્યાંથી આવો છો? - Where are you from?',
          english: 'How to ask basic questions in Gujarati'
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ગુજરાતી પાઠો</h1>
          <p className="text-xl">Gujarati Lessons</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ગુજરાતી ભાષા શીખવાના પાઠો</CardTitle>
            <CardDescription>
              Structured lessons to help you learn the Gujarati language systematically
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="chapter1" value={activeChapter} onValueChange={setActiveChapter} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {lessons.map(lesson => (
              <TabsTrigger key={lesson.id} value={lesson.id}>
                {lesson.englishTitle}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {lessons.map(lesson => (
            <TabsContent key={lesson.id} value={lesson.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.englishTitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {lesson.sections.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                              {section.content}
                            </div>
                            <div className="p-4">
                              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Explanation:</h4>
                              <p>{section.english}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default GujaratiLessonsPage;
