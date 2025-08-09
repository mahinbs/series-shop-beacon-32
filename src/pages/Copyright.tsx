import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';

const Copyright = () => {
  usePageScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Copyright Notice</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Copyrights</h2>
              <p className="text-muted-foreground mb-4">
                At Crossed Hearts, we respect the intellectual property rights of others and expect our users to do the same. We have a strict policy against copyright infringement and may suspend or terminate access to users who are repeat offenders.
              </p>
              <p className="text-muted-foreground mb-4">
                If you believe that content available on or through thecrossedhearts.com infringes upon your copyright or the copyright of a party you represent, please submit a notice of claimed infringement in accordance with the Safe Harbor provisions of the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">To file a copyright infringement notice, please send a written communication to our designated Copyright Agent that includes the following:</h3>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-6">
                <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
                <li>Identification of the copyrighted work(s) claimed to have been infringed. If multiple works are involved, a representative list should be included.</li>
                <li>Identification of the infringing material and sufficient information (such as URL and screenshots) to help us locate the alleged infringing content.</li>
                <li>A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in your notice is accurate and under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the copyright owner.</li>
                <li>Your full name, address, telephone number and a valid email address so we may contact you if needed.</li>
              </ol>
              
              <div className="bg-card p-6 rounded-lg border mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Send your notice to:</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground">Copyright Agent</h4>
                    <p>Crossed Hearts, LLP.</p>
                    <p>5551, Hollywood Boulevard,</p>
                    <p>Hollywood, California, USA - 90028</p>
                  </div>
                  
                  <div>
                    <p>Crossed Hearts, LLP.</p>
                    <p>349, 15th Cross, 17th Main,</p>
                    <p>Sector 4, HSR Layout, Bangalore,</p>
                    <p>Karnataka, India - 560102</p>
                  </div>
                  
                  <div>
                    <p><strong>Phone:</strong> +91 97405 59134</p>
                    <p><strong>Email:</strong> proposals@thecrossedhearts.com</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Trademarks</h2>
              <p className="text-muted-foreground mb-4">
                All logos, graphics, icons, page headers, features, and service names used or displayed on this website are trademarks, service marks, or trade dress of Crossed Hearts unless otherwise stated. These marks may not be used - without prior written permission - in any manner likely to cause confusion or imply endorsement by Crossed Hearts.
              </p>
              <p className="text-muted-foreground mb-4">
                Any third-party trademarks appearing on this site are the property of their respective owners. Their appearance does not imply affiliation with, or endorsement by, Crossed Hearts.
              </p>
              <p className="text-muted-foreground font-semibold">
                All rights reserved.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Copyright;