/**
 * Features page component showcasing QR Maker's capabilities
 */
import React from 'react';
import { 
  Palette, 
  Image, 
  QrCode, 
  Download, 
  Share2, 
  Shield, 
  BarChart3, 
  Smartphone,
  Globe,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Multiple QR Types',
    description: 'Create QR codes for websites, email addresses, phone numbers, and SMS messages.',
    details: ['Website URLs', 'Email addresses', 'Phone numbers', 'SMS messages']
  },
  {
    icon: Palette,
    title: 'Advanced Customization',
    description: 'Make your QR codes unique with our extensive customization options.',
    details: [
      'Custom colors with gradient support',
      'Multiple pattern styles',
      'Corner style customization',
      'Border customization',
      'Banner text with positioning'
    ]
  },
  {
    icon: Image,
    title: 'Logo Integration',
    description: 'Add your brand logo to QR codes with automatic color scheme matching.',
    details: [
      'Logo upload support',
      'Automatic color extraction',
      'Size adjustment',
      'Position optimization'
    ]
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    description: 'Download your QR codes in various formats for any use case.',
    details: ['PNG format', 'JPEG format', 'WebP format', 'Vector SVG']
  },
  {
    icon: Shield,
    title: 'Error Correction',
    description: 'Ensure your QR codes remain scannable even if partially damaged.',
    details: [
      'Low (7% recovery)',
      'Medium (15% recovery)',
      'High (25% recovery)',
      'Maximum (30% recovery)'
    ]
  },
  {
    icon: BarChart3,
    title: 'Analytics & Tracking',
    description: 'Track and analyze QR code performance with detailed insights.',
    details: [
      'Scan statistics',
      'Geographic data',
      'Device analytics',
      'Time-based reporting'
    ]
  }
];

const qrTypes = [
  {
    icon: Globe,
    title: 'Website URLs',
    description: 'Direct users to your website, landing pages, or any web content.'
  },
  {
    icon: Mail,
    title: 'Email Addresses',
    description: 'Generate QR codes that open email clients with pre-filled addresses.'
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    description: 'Create QR codes that initiate phone calls when scanned.'
  },
  {
    icon: MessageSquare,
    title: 'SMS Messages',
    description: 'Let users send text messages with pre-filled content.'
  }
];

export default function Features() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful QR Code Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional, customizable QR codes with our comprehensive set of features.
            Perfect for businesses and individuals alike.
          </p>
        </div>

        {/* QR Types Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Supported QR Code Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qrTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div 
                  key={type.title}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-8 h-8 text-indigo-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600">
                    {type.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <Icon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li 
                      key={detail}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Create Your QR Code?
          </h2>
          <p className="text-gray-600 mb-8">
            Start generating professional QR codes in minutes with our easy-to-use tool.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Create QR Code
          </a>
        </div>
      </div>
    </div>
  );
}