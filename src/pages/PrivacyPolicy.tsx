import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';

export default function PrivacyPolicy() {
  usePageScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy for Crossed Hearts</h1>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                This Privacy Policy outlines the types of data we gather and how we handle it with care.
                If you have any questions or need further clarification about this Privacy Policy, we warmly encourage you to reach out to Crossed Hearts and we are here to help.
              </p>

              <p>
                This Privacy Policy applies solely to our online activities. It is valid for visitors to our website with regards to the information that they shared or we collected on thecrossedhearts.com, and to any information collected by us if you interact with our social media pages, emails, email newsletters, applications and advertisements (collectively referred to as our "Services").
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Consent</h2>
              <p>
                By choosing to use our Services, you hereby consent to our Privacy Policy and agree to its terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
              <p>
                When you contact us directly, we may ask for or receive additional information such as your name, email address, phone number, the content of your message, attachments and any other information you choose to provide.
              </p>
              <p>
                When you register for an account, we may request certain personal details such as your name, company name, age, address, email, telephone number and payment information (where applicable).
              </p>
              <p>
                We, and the partners we work with, may automatically collect personal information through cookies when you use our services. For more details about what personal information we and certain partners may collect from or about you through Cookies, please refer to our Cookie Policy, which is subject to and part of this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deliver, manage, and keep our services operational.</li>
                <li>Enhance, customize and broaden our services.</li>
                <li>Recognise and examine your usage of our services.</li>
                <li>Create, develop, and promote our products, services, features, and their capabilities.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the services, and for marketing and promotional purposes</li>
                <li>Help detect and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">With Whom We May Share Your Information</h2>
              <p>We value your privacy. When needed, we may share your information with the following:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> who may use your information to provide us services related to billing, payment processing and collections, auditing and accounting, consulting, analytics, security, website hosting, conducting surveys and promotions, customer service, email newsletter delivery services, anti-fraud monitoring, and information technology.</li>
                <li><strong>Social Media Platforms:</strong> When interacting with us through social media platforms, several programs may collect your personal information via cookies.</li>
                <li><strong>Advertising Partners:</strong> Our advertising partners help us promote our products and services and they may use cookies to gather or obtain your personal data via our services and other websites online to deliver targeted advertising.</li>
                <li><strong>Government & Law Enforcement:</strong> Government and law enforcement agencies will receive personal information when we are legally permitted to share it or when it's necessary to safeguard our interests or the safety of individuals.</li>
                <li>We may transfer information to other businesses in a commercial transaction, such as a change in ownership or corporate structure, or to any other third party with your consent or at your direction.</li>
              </ul>

              <p>
                Crossed Hearts may also share potentially identifiable and personally identifiable information with its staff, subcontractors and associated organisations that require access to this data to handle it on Crossed Hearts' behalf or to offer the services. Employees, contractors and affiliated organisations which are located abroad may be handling your data, by using our services, you agree to transfer this information to them.
              </p>

              <p>
                Crossed Hearts takes the necessary steps to safeguard against the unauthorised access, use, alteration or destruction of potentially identifiable and identifiable personal information.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Log Files</h2>
              <p>
                We, in the website thecrossedhearts.com, employ log files as an integral component of its standard operational procedures, a practice shared by many other websites. Files on websites record every visit from people who access them. This characteristic is a feature of all hosting companies' analytics. Information collected by log files includes IP addresses, the type of browser being used, the Internet Service Provider (ISP), a date and time stamp, the referring and exit pages, and possibly the number of clicks. These statements are not linked to any individual identifiable data. The data will be used for trend analysis, site management, user's movement tracking and gathering demographic information.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Privacy Policies</h2>
              <p>
                Ad servers or third-party ad networks employ technologies like cookies, JavaScript, or Web Beacons within their ads and links on thecrossedhearts.com, which are directly transmitted to users' browsers. When this occurs, your IP address is automatically received by them. This technology is employed to assess the efficacy of their advertising campaigns or to customize the advertising content displayed on websites that you browse.
              </p>

              <p>
                It is worth noting that thecrossedhearts.com has no access to or control over Cookies used by third-party advertisers. You can disable cookies by adjusting your browser's settings. For more detailed cookie management information, visit the website of your specific web browser.
              </p>

              <p>
                The website thecrossedhearts.com may contain links to external websites that are not affiliated with or operated by our company. Clicking on a third-party link will redirect you to that party's website. Crossed Hearts' privacy policy does not extend to other advertisers or websites. We do not control or take responsibility for the privacy policies or practices of any third-party websites. We recommend that you review the privacy policies of these third parties for further information, such as their privacy policies, practices and procedures and guidance on how to opt out of specific choices.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Aggregated Statistics</h2>
              <p>
                Crossed Hearts may collect the statistics about visitor behaviour and may share that data in reports or publications.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">CCPA Rights to Privacy (Do Not Sell My Personal Information)</h2>
              <p>Under the CCPA, among other rights, California consumers have the right to:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Request that a business collecting a consumer's personal information disclose the categories and specific pieces of personal information that have been collected.</li>
                <li>Request that a business erase any personal information it has obtained regarding the consumer.</li>
                <li>Request that a company selling a customer's personal information cease such sales.</li>
              </ol>
              <p>
                Businesses collecting consumer data should correct any inaccurate information. If a request is made, we have 10 days to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">GDPR Data Protection Rights and US State Privacy Laws</h2>
              <p>Users in jurisdictions governed by the General Data Protection Regulations and some federal or U.S. state jurisdiction are entitled to the following:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have the right to request copies of your personal data. A small fee may be charged for this service. We may charge you a small fee for this service.</li>
                <li>You have the right to request that we correct any information you believe is inaccurate. You also have the right to ask us to fill in any information that you think is missing.</li>
                <li>You have the right to request that we delete your personal data under specific circumstances.</li>
                <li>You have the right to ask us to limit the processing of your personal information under specific circumstances.</li>
                <li>You have the right to object to our processing or sharing of your personal data under specific circumstances.</li>
                <li>Under certain conditions, you have the right to request that we transfer the data we have collected to another organisation, or directly to you.</li>
                <li>The protection from retaliation. You have the right to be free from discrimination by us when you exercise any of the rights granted to you under the law that applies to you.</li>
              </ul>
              <p>
                We'll respond to your request within one month. Please don't hesitate to contact us to exercise these rights.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Children's Information</h2>
              <p>
                Our services are not designed for individuals under the age of 18. Parents and guardians are encouraged to observe, participate in, and/or monitor and guide their children's online activity.
              </p>
              <p>
                If you are a parent or guardian and think your child has provided personal information, we need to be contacted straight away. We will take prompt action to eliminate such data.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Security</h2>
              <p>
                Ensuring the security of your personal information is a priority for us. No method of internet transmission or electronic storage can be 100% secure. We aim to use commercially acceptable methods to safeguard your personal data, but we cannot ensure its complete security.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Privacy Policy Changes</h2>
              <p>
                This Privacy Policy may be updated from time to time. By continuing to use our services after any updates to the Privacy Policy, you are agreeing to those changes.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Choice of Law</h2>
              <p>
                This Privacy Policy and its interpretations will be interpreted and governed by the laws of New York State, disregarding its conflict of laws principles. By using our services, you agree that any legal proceedings arising directly or indirectly from the services, their use, access, or this Privacy Policy will be heard in the relevant state or federal courts based in New York, N.Y. You hereby consent and agree to the exclusive personal jurisdiction and venue of the relevant federal and state courts in New York, for any such legal proceedings. You acknowledge that any potential lawsuit or claim related to the services must be initiated within one year of its occurrence or else you will be deemed to have forfeited the right to pursue such a claim.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
              <p>If you have any questions, concerns, or feedback, we'd love to hear from you:</p>
              
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div>
                  <strong>Crossed Hearts, Inc.</strong><br />
                  5551, Hollywood Boulevard,<br />
                  Hollywood, California, USA-90028
                </div>
                
                <div>
                  <strong>Crossed Hearts, Inc.</strong><br />
                  349, 15th Cross, 17th Main,<br />
                  Sector 4, HSR Layout, Bangalore,<br />
                  Karnataka, India-560102
                </div>
                
                <div>
                  <strong>Ph:</strong> +91 9740715563<br />
                  <strong>E-mail:</strong> general@crossedhearts.com
                </div>
              </div>

              <p className="text-sm">
                To unsubscribe from our mailing list, please click on the unsubscribe icon from this list link, on the footer of our weekly newsletters or send a request to general@crossedhearts.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}