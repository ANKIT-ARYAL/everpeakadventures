import React from 'react';
import { prisma } from '@/lib/prisma';
import { Shield, Mail, MapPin } from 'lucide-react';
import SubpageHeroContent from '@/app/components/pages/SubpageHeroContent';
import { Reveal } from '@/app/components/animations/Motion';

export default async function PrivacyPolicyPage() {
  const pageData = await prisma.privacyPolicyContent.findFirst();

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-800 pb-20">
      
      {/* Hero Banner Section */}
      <SubpageHeroContent
        slug="privacy-policy"
        fallbackTitle="Privacy Policy"
        fallbackSubtitle="Have questions or ready to plan your Himalayan adventure? Our friendly and experienced team is here to help you every step of the way."
        fallbackImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
      />

      {/* Main Content Box */}
      <section className="max-w-4xl mx-auto px-5 -mt-16 relative z-20">
        <Reveal className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 space-y-8 text-gray-600 text-[14px] leading-relaxed">
          
          {pageData?.contentHtml ? (
            <div 
              className="wordpress-content space-y-6"
              dangerouslySetInnerHTML={{ __html: pageData.contentHtml }}
            />
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                <strong>Ever Peak Adventure</strong> values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website, make inquiries, or book our services.
              </p>
              <p className="text-xs text-gray-500 italic">
                By using our website and services, you agree to the practices described in this policy.
              </p>

              <div className="space-y-6 pt-4">
                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    1. Information We Collect
                  </h2>
                  <p className="mb-2">We may collect the following types of information:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, nationality, passport details (when required for permits), and other details you provide during inquiries or bookings.</li>
                    <li><strong>Booking & Travel Information:</strong> Trip preferences, emergency contact details, and special requirements.</li>
                    <li><strong>Payment Information:</strong> Limited payment-related details processed securely through trusted payment gateways (we do not store full card details).</li>
                    <li><strong>Technical Information:</strong> IP address, browser type, device information, and website usage data through cookies.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    2. How We Use Your Information
                  </h2>
                  <p className="mb-2">Your information is used to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Respond to inquiries and provide requested services</li>
                    <li>Process bookings, permits, and travel arrangements</li>
                    <li>Communicate important updates and information</li>
                    <li>Improve our website, services, and customer experience</li>
                    <li>Comply with legal and regulatory requirements</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">We only collect information that is necessary for providing our services.</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    3. Information Sharing & Disclosure
                  </h2>
                  <p className="font-semibold text-gray-800 mb-2">Ever Peak Adventure does not sell, rent, or trade your personal information.</p>
                  <p className="mb-2">We may share your information only with:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Government authorities (for permits, visas, or legal requirements)</li>
                    <li>Trusted partners such as guides, hotels, transport providers, or insurance companies (only when necessary for your trip)</li>
                    <li>Payment processors for secure transactions</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">All third parties are required to protect your data and use it solely for service delivery.</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    4. Data Security
                  </h2>
                  <p>
                    We take reasonable technical and organizational measures to protect your personal information from unauthorized access, misuse, loss, or disclosure. While no online system is completely secure, we continuously work to maintain strong data protection standards.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    5. Cookies & Tracking Technologies
                  </h2>
                  <p className="mb-2">Our website may use cookies to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Enhance user experience</li>
                    <li>Analyze website traffic and performance</li>
                    <li>Remember user preferences</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">You can control or disable cookies through your browser settings, though this may affect some website features.</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    6. Your Rights
                  </h2>
                  <p className="mb-2">You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your data (subject to legal or operational requirements)</li>
                    <li>Withdraw consent for marketing communications at any time</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">To exercise these rights, please contact us directly.</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    7. External Links
                  </h2>
                  <p>
                    Our website may contain links to third-party websites. Ever Peak Adventure is not responsible for the privacy practices or content of external sites. We encourage users to review their privacy policies separately.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    8. Changes To This Privacy Policy
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in laws or services. Any updates will be posted on this page with immediate effect.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#222222] oswald uppercase tracking-tight mb-3">
                    9. Contact Us
                  </h2>
                  <p className="mb-4">
                    If you have any questions or concerns regarding this Privacy Policy or how we handle your data, please contact us at:
                  </p>
                  <div className="bg-[#f8faf9] p-5 rounded-2xl border border-gray-100 space-y-3">
                    <p className="font-bold text-gray-900 oswald">Ever Peak Adventure</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <Mail className="w-4 h-4 text-[#24a0ed]" />
                      <a href="mailto:info@everpeakadventures.com" className="hover:underline">info@everpeakadventures.com</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <MapPin className="w-4 h-4 text-[#24a0ed]" />
                      <span>Kathmandu, Nepal</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </Reveal>
      </section>

    </div>
  );
}