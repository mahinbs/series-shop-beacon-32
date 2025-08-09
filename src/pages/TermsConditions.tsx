import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';

const TermsConditions = () => {
  usePageScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
            
            <div className="bg-card p-6 rounded-lg border mb-8">
              <p className="text-muted-foreground mb-4">
                <strong>Welcome to Crossed Hearts!</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                These terms and conditions specify the guidelines for using the Crossed Hearts, LLP. Website which can be found at thecrossedhearts.com.
              </p>
              <p className="text-muted-foreground mb-4">
                Crossed Hearts is the owner of the rights of the content on this website. Crossed Hearts is a registered trademark, as is the Crossed Hearts logo. Crossed Hearts retains all rights to these trademarks and copyrights.
              </p>
              <p className="text-muted-foreground">
                You accept the terms and conditions of this website's use by visiting it. Please stop using thecrossedhearts.com if you disagree with our terms and conditions.
              </p>
            </div>

            <section className="mb-8">
              <p className="text-muted-foreground mb-6">
                These Terms and Conditions, Privacy Statement, Disclaimer Notice and all other agreements between you and Crossed Hearts are referred to by the following terms: "You" refers to you, the user of Crossed Hearts' website, social media accounts, and merchandise. For Crossed Hearts, "The Company," "Ourselves," "We," "Our," and "Us" are used. You and us are both referred to as "Party," "Parties," and "Us" same. According to and subject to the applicable laws of New York and the United States, all terms refer to the offer, acceptance and consideration of payment required to help you in the most suitable way. Terms and other terms are regarded as interchangeable and relate to the same thing regardless of whether they are used in the singular, plural, capitalisation, or gender.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are used by us. You consent to the usage of cookies in line with the Crossed Hearts Privacy Policy by using thecrossedhearts.com.
              </p>
              <p className="text-muted-foreground">
                Cookies are used by the majority of interactive websites to retrieve user information each time a user visits. Cookies make things easier for users by enabling certain features. Cookies may also be used by some of our advertising and affiliate partners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">License</h2>
              <p className="text-muted-foreground mb-4">
                All content on thecrossedhearts.com is the intellectual property of Crossed Hearts and/or its licensors, unless otherwise noted. The rights of every intellectual property are reserved. Subject to the limitations outlined in these Terms and Conditions, you may visit thecrossedhearts.com.
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-4">
                <li>You are prohibited from republishing Content from thecrossedhearts.com.</li>
                <li>You must not buy, sell, or acquire content from thecrossedhearts.com.</li>
                <li>You should not reproduce or replicate content from thecrossedhearts.com.</li>
                <li>Sharing contents from thecrossedhearts.com in other locations is strictly prohibited.</li>
              </ol>
              <p className="text-muted-foreground">
                This Agreement is effective as of this date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No Spam</h2>
              <p className="text-muted-foreground">
                You may not use thecrossedhearts.com or any of our tools to transmit unsolicited bulk communications (including emails and instant messages). You may not harvest information about our users for sending unsolicited bulk communications. We may terminate your access or use of thecrossedhearts.com immediately if you or anyone using your access violates these provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Hyperlinking to Our Content</h2>
              <p className="text-muted-foreground mb-4">
                Organizations listed below may link to our Website without first obtaining prior written approval.
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Government agencies</li>
                <li>Search engines</li>
                <li>News organizations</li>
              </ol>
              <p className="text-muted-foreground mb-4">
                Directory providers that operate online. Online directory distributors
              </p>
              <p className="text-muted-foreground mb-4">
                Accredited businesses, excluding non-profit organizations, charity shopping centres, and charitable fundraising groups, operate system-wide. System-wide accredited businesses (except non-profit organizations, charity shopping malls, and charity fundraising groups)
              </p>
              
              <div className="bg-card p-4 rounded-lg border mb-4">
                <p className="text-muted-foreground mb-2">These organizations may link to our homepage, publications, or other website information, provided the link is:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Not deceptive</li>
                  <li>The linking party's products and services are not implied to be sponsored, endorsed, or approved.</li>
                  <li>Complies with the linking party's website context.</li>
                </ul>
              </div>

              <p className="text-muted-foreground mb-4">
                We may also approve link requests from organizations like consumer/business information providers, community websites, educational establishments, and trade associations. The link must be approved.
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Be truthful.</li>
                <li>Do not imply that a linked party is sponsored, endorsed, or approved by us.</li>
                <li>Conform to the parameters set by the hosting website of the linking party.</li>
              </ul>

              <p className="text-muted-foreground">
                In order to obtain approval for a link, please send an email to Crossed Hearts which should include your name, the name of your organization, your contact information, and the URLs you want to link to/from. A response can be expected within 2-3 weeks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Frames</h2>
              <p className="text-muted-foreground">
                You are not permitted to create frames around our web pages without prior approval, which can change their visual presentation or appearance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                Crossed Hearts shall not be held liable for any direct, indirect, special, or consequential damages, including loss of use, profits, or data, arising from the use or non-use of the website, and any inaccuracies or errors on the site. Your liability under these terms is limited to $5 or the compensation paid to Crossed Hearts, whichever is the lesser amount.
              </p>
              <p className="text-muted-foreground">
                You agree to compensate Crossed Hearts, its officers, employees, agents, licensors, and third-party providers for any losses, expenses, and costs arising from any breach of this Agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Privacy</h2>
              <p className="text-muted-foreground">
                Please read our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reservation of Rights</h2>
              <p className="text-muted-foreground">
                We reserve the right to request the removal of any links, including all or specific ones, associated with our website. You agree to quickly delete any link once we ask for it. We also reserve the right to alter these Terms and Conditions and the linking policy at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Removal of Links</h2>
              <p className="text-muted-foreground">
                If you encounter any offensive links on our website, please do not hesitate to get in touch with us. We may consider removing links at your request, but we are under no obligation to reply or take action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer</h2>
              <p className="text-muted-foreground">
                As permitted by applicable law, we exclude all warranties and conditions related to our website to the fullest extent possible. We will not be liable for any loss or damage, provided that the website and its services are made available free of charge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Choice of Law</h2>
              <p className="text-muted-foreground">
                The interpretation and application of this Privacy Policy are subject to the laws of New York. By accessing this website, you agree to the exclusive jurisdiction and venue of the courts in New York for any legal issues associated with the website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;