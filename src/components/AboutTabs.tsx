import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AboutUsService, type AboutUsSection } from '@/services/aboutUsService';
const AboutTabs = () => {
  const {
    elementRef,
    isVisible
  } = useScrollAnimation(0.2);
  
  const [tabData, setTabData] = useState({
    about: {
      title: "About Us",
      content: {
        heading: "About Crossed Hearts",
        text: "Crossed Hearts is a global publishing house specializing in the English localization and international distribution of Japanese manga, Korean webcomics, and Asian novels. With a commitment to bringing the finest stories from Asia to readers worldwide, we work directly with leading publishers, creators, and studios to produce high-quality print and digital editions that remain true to the original vision while connecting deeply with global audiences.",
        subtext: "Our publishing program spans bestselling romance, action, fantasy, isekai, and mystery genres, including titles with major anime adaptations and vast international fanbases:",
        highlights: ["Romance that makes you smile in public (and pretend you're not).", "Fantasy so rich you'll lose yourself in its world.", "Isekai so good you'll check both ways for Truck-kun.", "Mystery that lingers in your mind long after the last page.", "Action that keeps your heart pounding."],
        additionalText: "Our journey begins with the first wave of English print editions in Q4 2025. These acclaimed titles have captured millions of hearts worldwide and will soon be reaching readers from New York to Toronto, London to Delhi, Sydney to Auckland through our global distribution network, which includes Simon & Schuster, Publisher's Group West (Ingram), and Script UK. Our books will be available in major bookstores, online retailers, and specialty outlets across multiple continents.",
        closingText: "We invite you to be part of our journey!"
      },
      image: "/lovable-uploads/a0c88e05-5aba-4550-8ee0-7644ad456776.png"
    },
    mission: {
      title: "Our Mission",
      content: {
        heading: "Our Mission",
        text: "What if the story you've been waiting for your whole life was already out there—half a world away—just waiting to find you? At Crossed Hearts, we make those encounters happen.",
        subtext: "We are readers first, publishers second. Our mission is simple: to bring acclaimed Korean webcomics, Japanese manga, and Asian novels to English-speaking readers worldwide, while preserving the soul of the original. Every panel, every line, every quiet pause is carried over with care, because we know the smallest details hold the greatest magic.",
        highlights: ["True to the Original – We work side-by-side with creators to preserve their vision, voice, and emotional heartbeat.", "Authentic Localization – Cultural essence stays intact, so you feel the story exactly as it was meant to be felt. If a joke lands in Seoul or Tokyo, it should land in Seattle or Toronto.", "Passion-Driven Curation – We handpick stories worth treasuring, introducing you to worlds and characters you never knew you needed."],
        additionalText: "From midnight debates over which series to license to the moment a book lands in your hands, we live for that spark when a story crosses languages and still feels like it was written just for you.",
        closingText: "When East meets West on the page, distance disappears. Borders fade. A truly powerful story speaks directly to the heart, no matter where it came from. When it does, you'll feel it instantly."
      },
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    team: {
      title: "Our Team",
      content: {
        heading: "Our Team",
        text: "Our name, Crossed Hearts, comes from the idea of two hearts finding each other across distance. Like fingers crossed for good luck—in our case, its hearts crossing borders, languages, and cultures. It's that moment when a story leaves the creator's hands and finds its way to a reader who will treasure it just as deeply.",
        subtext: "We are a team of over 30 passionate individuals driven by a shared love for storytelling. Based across time zones, with offices in Los Angeles, USA and Bengaluru, India, we work seamlessly to ensure every title we publish stays true to its original vision while resonating with readers around the world.",
        highlights: ["Over 30 passionate individuals across time zones", "Offices in Los Angeles, USA and Bengaluru, India", "Over a year of behind-the-scenes work refining translations and layouts"],
        additionalText: "For over a year, we've been quietly working behind the scenes, refining translations, perfecting layouts, and crafting every detail to ensure the heart of the original shines through. Soon, you'll get to see and hold the results.",
        closingText: "Mark your calendars. The countdown to the release of our first titles has begun. Our first chapter starts soon, and we can't wait for you to be a part of it!"
      },
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    imprints: {
      title: "Our Imprints",
      content: {
        heading: "Our Imprints",
        text: "We're launching several specialized imprints to bring you the best stories across different genres and formats:",
        subtext: "",
        highlights: ["BLUSH CLUB (2026) - Dedicated imprint for shounen ai, yaoi, and boy's love stories from across Asia, carefully localized in English for a global readership. From tender first loves to high-stakes romances set against fantastical backdrops, BLUSH CLUB curates series that celebrate love between men in all its forms.", "GLAM POP! (2027) - Imprint for shoujo ai, yuri, and girl's love series that span multiple genres, all brought to life in English with care and authenticity. GLAM POP! showcases stories of love, friendship, and connection between women, ranging from sweet slice-of-life romances to epic, otherworldly adventures.", "ONE & DONE (2026) - Designed for readers who want the full experience in one sitting. Specializing in standalone manga volumes that can be read and loved from start to finish in a single go, ONE & DONE is for the binge-reader who can't wait months for the next volume.", "E-NOVEL PRESS (2026) - Brings the best of Asian novels—from the original stories behind hit webcomics and manga to captivating new works—into the hands of English-speaking readers worldwide. Our catalogue spans romance, fantasy, action, mystery, horror, and sci-fi."],
        additionalText: "",
        closingText: ""
      },
      image: "/lovable-uploads/cf6711d2-4c1f-4104-a0a1-1b856886e610.png"
    }
  });

  // Load data from Supabase (managed by admin panel)
  useEffect(() => {
    const loadSections = async () => {
      try {
        const sections = await AboutUsService.getSections();
        const formattedData = {};
        
        sections.forEach(section => {
          formattedData[section.section_key] = {
            title: section.title,
            content: {
              heading: section.heading,
              text: section.main_text,
              subtext: section.subtext || '',
              highlights: section.highlights || [],
              additionalText: section.additional_text || '',
              closingText: section.closing_text || ''
            },
            image: section.image_url
          };
        });
        
        if (Object.keys(formattedData).length > 0) {
          setTabData(formattedData);
          console.log('✅ Loaded About Us sections from Supabase:', formattedData);
        }
      } catch (error) {
        console.error('Error loading about us sections:', error);
      }
    };
    
    loadSections();
  }, []);
  return <section ref={elementRef} className={`py-16 bg-black transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="container mx-auto px-4">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-transparent border-none p-0 h-auto gap-8">
            <TabsTrigger value="about" className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300">
              About Us
            </TabsTrigger>
            <TabsTrigger value="mission" className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300">
              Our Mission
            </TabsTrigger>
            <TabsTrigger value="team" className="bg-transparent border-none p-0 h-auto text-xl font-bold text-gray-300 data-[state=active]:text-red-500 data-[state=active]:bg-transparent relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300">
              Our Team
            </TabsTrigger>
            
          </TabsList>

          {Object.entries(tabData).map(([key, data]) => <TabsContent key={key} value={key} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  <h3 className="text-3xl font-bold text-white mb-6">{data.content.heading}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {data.content.text}
                  </p>
                  {data.content.subtext && <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {data.content.subtext}
                    </p>}
                  {data.content.highlights && data.content.highlights.length > 0 && <ul className="space-y-3 mb-6">
                      {data.content.highlights.map((highlight, index) => <li key={index} className="flex items-start text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{highlight}</span>
                        </li>)}
                    </ul>}
                  {data.content.additionalText && <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {data.content.additionalText}
                    </p>}
                  {data.content.closingText && <p className="text-gray-300 text-lg leading-relaxed font-semibold">
                      {data.content.closingText}
                    </p>}
                </div>
                <div className={`relative transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                  <img src={data.image} alt={data.title} className="rounded-lg shadow-2xl w-full h-[400px] object-cover" />
                </div>
              </div>
            </TabsContent>)}
        </Tabs>
      </div>
    </section>;
};
export default AboutTabs;