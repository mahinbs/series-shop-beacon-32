
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AboutTabs = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  const tabData = {
    story: {
      title: "Our Story",
      content: {
        heading: "How It All Started",
        text: "Founded in 2016, Crossed Hearts began as a passion project by a small group of manga enthusiasts who wanted to share incredible Japanese and Korean stories with the world. What started in a small apartment has grown into a global publishing house, but our core mission remains the same: bringing exceptional storytelling to readers everywhere.",
        highlights: [
          "Started by passionate manga enthusiasts",
          "Global reach from humble beginnings", 
          "Commitment to quality storytelling"
        ]
      },
      image: "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png"
    },
    mission: {
      title: "Our Mission",
      content: {
        heading: "Bridging Cultures Through Stories",
        text: "We believe stories have the power to connect people across cultures and languages. Our mission is to carefully localize manga and webtoons while preserving their cultural essence, making them accessible to readers worldwide without losing what makes them special.",
        highlights: [
          "Cultural bridge through storytelling",
          "Preserving authentic voices",
          "Global accessibility without compromise"
        ]
      },
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    future: {
      title: "Our Future",
      content: {
        heading: "Looking Ahead",
        text: "As we continue to grow, our vision expands beyond just publishing. We're building a comprehensive ecosystem where creators and readers can connect, discover new stories, and be part of a global community that celebrates diverse storytelling from every corner of the world.",
        highlights: [
          "Expanding creator partnerships globally",
          "Innovation in digital storytelling",
          "Building stronger reader communities"
        ]
      },
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  };

  return (
    <section 
      ref={elementRef}
      className={`py-16 bg-black transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-transparent border-none p-0 h-auto gap-8">
            <TabsTrigger 
              value="story" 
              className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Our Story
            </TabsTrigger>
            <TabsTrigger 
              value="mission"
              className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Our Mission
            </TabsTrigger>
            <TabsTrigger 
              value="future"
              className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Our Future
            </TabsTrigger>
          </TabsList>

          {Object.entries(tabData).map(([key, data]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-700 transform ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}>
                  <h3 className="text-3xl font-bold text-white mb-6">{data.content.heading}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {data.content.text}
                  </p>
                  <ul className="space-y-3">
                    {data.content.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative transition-all duration-700 transform ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                  <img 
                    src={data.image}
                    alt={data.title}
                    className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default AboutTabs;
