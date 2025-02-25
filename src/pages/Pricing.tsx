/**
 * Pricing page component
 */
import React from 'react';
import { Check, QrCode } from 'lucide-react';

const features = [
  'Unlimited QR Code Generation',
  'Multiple QR Code Types',
  'Free Dynamic QR Codes',
  'URL Redirection & Updates',
  'Basic Analytics & Tracking',
  'Custom Colors & Gradients',
  'Logo Integration',
  'Banner Text Support',
  'High-Quality Downloads',
  'Multiple Export Formats'
];

const comingSoon = [
  'Advanced Analytics Dashboard',
  'Custom Analytics Reports',
  'Scan Location Heatmaps',
  'Bulk Generation',
  'Team Collaboration',
  'API Access',
  'White Label Options',
  'Priority Support',
  'Custom Domains'
];

export default function Pricing() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Create professional QR codes with our powerful free plan, including dynamic QR codes at no cost.
          </p>
          <p className="text-lg text-indigo-600 font-medium">
            Dynamic QR codes are and will always be FREE!
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-600">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <span className="text-3xl font-bold text-indigo-600">$0</span>
            </div>

            <a
              href="/"
              className="block w-full py-3 px-4 bg-indigo-600 text-white text-center font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-8"
            >
              Get Started
            </a>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Plan */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="text-gray-600">Coming soon</p>
              </div>
              <span className="text-lg font-medium text-gray-500">Stay tuned!</span>
            </div>

            <button
              disabled
              className="w-full py-3 px-4 bg-gray-100 text-gray-500 text-center font-medium rounded-lg cursor-not-allowed mb-8"
            >
              Coming Soon
            </button>

            <div className="space-y-4">
              {comingSoon.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  <span className="text-gray-500">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are dynamic QR codes really free?
              </h3>
              <p className="text-gray-600">
                Yes! Unlike other services, we believe dynamic QR codes should be free. You can create unlimited
                dynamic QR codes and update their destinations anytime without paying a cent.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in dynamic QR codes?
              </h3>
              <p className="text-gray-600">
                Our free dynamic QR codes include URL redirection, unlimited updates to destinations,
                basic analytics (scans, devices, locations), and scan tracking - all at no cost.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are there any usage limits?
              </h3>
              <p className="text-gray-600">
                The free plan has no limits on QR code creation, downloads, or URL updates.
                Premium features will focus on advanced analytics and team collaboration tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need to create an account?
              </h3>
              <p className="text-gray-600">
                No account is required to create and download QR codes. However, creating an account
                lets you save QR codes and manage their destinations over time.
              </p>
            </div>
          </div>
        </div>
        
        {/* Dynamic QR Codes Highlight */}
        <div className="mt-16 bg-indigo-50 p-8 rounded-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Are Our Dynamic QR Codes Free?
            </h2>
            <p className="text-gray-600 mb-6">
              We believe dynamic QR codes should be accessible to everyone. While other services charge
              monthly fees for this feature, we're committed to keeping it free. Our premium features
              will focus on advanced analytics and team collaboration tools, not basic functionality
              that should be available to all.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Create Your Free Dynamic QR Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}