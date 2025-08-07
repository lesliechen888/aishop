'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import ContactMethods from '@/components/ContactMethods';
import ContactFAQ from '@/components/ContactFAQ';
import ChatBot from '@/components/ChatBot';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <ContactHero />
        
        {/* Contact Methods */}
        <ContactMethods />
        
        {/* Contact Form & Info */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <ContactFAQ />
      </main>
      
      {/* ChatBot */}
      <ChatBot />
      
      <Footer />
    </div>
  );
}
