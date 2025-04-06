
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GujaratiPoemsPage = () => {
  const [activeTab, setActiveTab] = useState('poem1');

  const poems = [
    {
      id: 'poem1',
      title: 'ફૂલડાં રે ફૂલડાં',
      englishTitle: 'Fulda Re Fulda',
      content: `ફૂલડાં રે ફૂલડાં રે ફૂલડાં
કેવાં સુંદર ફૂલડાં
ટોપલી ભરી મેં તો તોડ્યાં ફૂલડાં
કરીશ હું શું આજ ફૂલડાંનું?`,
      explanation: 'This is a popular Gujarati children\'s poem about flowers. It describes the beauty of flowers and what one might do with them after picking them.',
      translation: 'Flowers, oh flowers, oh flowers,\nHow beautiful are the flowers,\nI picked a basketful of flowers,\nWhat shall I do with these flowers today?'
    },
    {
      id: 'poem2',
      title: 'ઝાડ',
      englishTitle: 'Tree',
      content: `ઝાડ પર એક પંખી બેઠું,
મીઠા મધુરા ગાન કરે,
પવન આવીને પંપાળે,
ઝાડ સળવળી જાય,
પાંદડા ખરી પડે જમીન પર,
લીલું ઘાસ ઉગી જાય.`,
      explanation: 'This poem is about a tree and a bird. It describes the relationship between nature elements - a bird singing on a tree, the wind rustling the leaves, and the cycle of nature.',
      translation: 'A bird sits on a tree,\nSinging sweet songs,\nThe wind comes and caresses,\nThe tree rustles,\nLeaves fall to the ground,\nGreen grass grows.'
    },
    {
      id: 'poem3',
      title: 'મારી સાયકલ',
      englishTitle: 'My Bicycle',
      content: `મારી સાયકલ, મારી સાયકલ
કાળી લાલ મારી સાયકલ
ઘૂમ ઘૂમ ફરે છે પૈંડા
જોઈ જોઈ સૌ કરે વાહ વાહ`,
      explanation: 'This children\'s poem is about a bicycle. It expresses the pride and joy of having a bicycle and riding it around while others admire it.',
      translation: 'My bicycle, my bicycle,\nBlack and red is my bicycle,\nThe wheels go round and round,\nEveryone who sees it says "wow wow"'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ગુજરાતી કવિતાઓ</h1>
          <p className="text-xl">Gujarati Poems</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>પ્રાચીન અને આધુનિક ગુજરાતી કવિતાઓનો ખજાનો</CardTitle>
            <CardDescription>
              Explore the treasure of traditional and modern Gujarati poems with translations and explanations
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="poem1" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {poems.map(poem => (
              <TabsTrigger key={poem.id} value={poem.id}>
                {poem.englishTitle}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {poems.map(poem => (
            <TabsContent key={poem.id} value={poem.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{poem.title}</CardTitle>
                  <CardDescription>{poem.englishTitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">કવિતા (Poem)</h3>
                      <div className="bg-muted p-4 rounded-md whitespace-pre-line text-lg">
                        {poem.content}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">અનુવાદ (Translation)</h3>
                      <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                        {poem.translation}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">સમજૂતી (Explanation)</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {poem.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default GujaratiPoemsPage;
