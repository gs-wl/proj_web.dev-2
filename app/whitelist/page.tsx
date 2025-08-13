'use client'

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Mail, MessageSquare, User, Wallet, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function WhitelistPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: '',
    experience: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-whitelist-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          reason: formData.reason,
          experience: formData.experience
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Whitelist application submitted successfully:', result);
        setIsSubmitted(true);
      } else {
        console.error('❌ Failed to submit application:', result.error);
        alert(`Failed to submit application: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      alert('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50" style={{ background: 'linear-gradient(to bottom, #f0fdfa, #ffffff, #f0fdfa)' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-20 w-20 mx-auto mb-4" style={{ color: '#41a290' }} />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your interest in W3-Energy. We&apos;ve received your whitelist application.
              </p>
            </div>

            <Card className="shadow-lg" style={{ borderColor: '#41a290' }}>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2" style={{ color: '#13493f' }}>
                    <Wallet className="h-5 w-5" />
                    <span className="font-mono text-sm">{address}</span>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0fdfa' }}>
                    <h3 className="font-semibold mb-2" style={{ color: '#13493f' }}>What happens next?</h3>
                    <ul className="text-sm space-y-2" style={{ color: '#13493f' }}>
                      <li>• Our team will review your application within 48 hours</li>
                      <li>• You&apos;ll receive an email notification about your status</li>
                      <li>• Approved wallets will gain immediate access to the platform</li>
                      <li>• You can check your status anytime by connecting your wallet</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: '#41a290' }}>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="text-white px-8 py-3"
                    style={{ backgroundColor: '#13493f' }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0f3d35'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#13493f'}
                  >
                    Return to Homepage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50" style={{ background: 'linear-gradient(to bottom, #f0fdfa, #ffffff, #f0fdfa)' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="hover:bg-teal-50"
              style={{ borderColor: '#41a290', color: '#13493f' }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Image 
                src="/logo/logo.png" 
                alt="W3-Energy Logo" 
                width={60} 
                height={60} 
                className="h-15 w-15"
              />
              <h1 className="text-4xl font-bold text-gray-900">W3-Energy</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Join the Whitelist
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is currently in beta and access is limited to whitelisted wallets.
              Apply below to get early access to sustainable DeFi investing.
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="mb-8 flex justify-center">
            <Card style={{ borderColor: '#41a290' }}>
              <CardContent className="p-6 text-center">
                {!isConnected ? (
                  <div>
                    <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Connect your wallet to apply for whitelist access</p>
                    <ConnectButton />
                  </div>
                ) : (
                  <div>
                    <CheckCircle className="h-8 w-8 mx-auto mb-3" style={{ color: '#41a290' }} />
                    <p className="text-sm text-gray-600 mb-2">Wallet Connected</p>
                    <p className="font-mono text-sm px-3 py-1 rounded" style={{ backgroundColor: '#13493f', color: '#ffffff' }}>{address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          {isConnected && (
            <Card className="shadow-lg" style={{ borderColor: '#41a290' }}>
              <CardHeader className="border-b" style={{ backgroundColor: '#f0fdfa', borderColor: '#41a290' }}>
                <CardTitle className="text-2xl flex items-center space-x-2" style={{ color: '#13493f' }}>
                  <MessageSquare className="h-6 w-6" />
                  <span>Whitelist Application</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4" />
                        <span>Full Name *</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        style={{ borderColor: '#41a290', backgroundColor: '#ffffff', color: '#13493f' }}
                        onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#13493f'}
                        onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#41a290'}
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Address *</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                        style={{ borderColor: '#41a290', backgroundColor: '#ffffff', color: '#13493f' }}
                        onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#13493f'}
                        onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#41a290'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Company/Organization (Optional)
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company or organization"
                      style={{ borderColor: '#41a290', backgroundColor: '#ffffff', color: '#13493f' }}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#13493f'}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#41a290'}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Why do you want to join? *
                    </label>
                    <Textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your interest in sustainable investing and RWA tokens..."
                      style={{ borderColor: '#41a290', backgroundColor: '#ffffff', color: '#13493f' }}
                      onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#13493f'}
                      onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#41a290'}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      DeFi Experience
                    </label>
                    <Textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe your experience with DeFi, staking, or cryptocurrency (optional)"
                      style={{ borderColor: '#41a290', backgroundColor: '#ffffff', color: '#13493f' }}
                      onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#13493f'}
                      onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#41a290'}
                    />
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#f0fdfa' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#13493f' }}>Platform Benefits</h3>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm" style={{ color: '#13493f' }}>
                      <li>• Access to exclusive RWA tokens</li>
                      <li>• Early investor advantages</li>
                      <li>• Sustainable investment opportunities</li>
                      <li>• Lower fees for beta users</li>
                      <li>• Direct impact on climate projects</li>
                      <li>• Community governance participation</li>
                    </ul>
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white px-12 py-3 text-lg"
                      style={{ backgroundColor: '#13493f' }}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0f3d35'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#13493f'}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-12 text-gray-600">
            <p>Questions? Contact us at <a href="mailto:whitelist@w3-energy.org" className="hover:underline" style={{ color: '#41a290' }}>whitelist@w3-energy.org</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}