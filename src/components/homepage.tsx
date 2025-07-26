'use client'

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useWhitelist } from '@/hooks/useWhitelist';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Leaf, 
  Zap, 
  Shield, 
  TrendingUp, 
  Globe, 
  Award,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Target,
  Lightbulb,
  Wind,
  Sun,
  Droplets,
  Battery,
  Recycle,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Homepage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { isWhitelisted, isLoading } = useWhitelist();
  const { isAdmin } = useAdmin();
  const [currentSlide, setCurrentSlide] = useState(0);


  // Whitelist status logging - no automatic redirect
  useEffect(() => {
    console.log('🏠 Homepage Whitelist Status:');
    console.log('  - isConnected:', isConnected);
    console.log('  - isLoading:', isLoading);
    console.log('  - isWhitelisted:', isWhitelisted);
    
    if (isConnected && !isLoading && isWhitelisted === false) {
      console.log('  - ❌ User is NOT whitelisted - staying on homepage');
    } else if (isConnected && !isLoading && isWhitelisted === true) {
      console.log('  - ✅ User is WHITELISTED - staying on homepage');
    } else if (isLoading) {
      console.log('  - ⏳ Still checking whitelist - waiting...');
    } else {
      console.log('  - 👤 Wallet not connected - staying on homepage');
    }
  }, [isConnected, isLoading, isWhitelisted]);

  // Auto-slide for hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);



  const heroSlides = [
    {
      title: "Sustainable Finance Revolution",
      subtitle: "Invest in tokenized real-world assets that create positive environmental impact",
      image: "🌱"
    },
    {
      title: "Carbon-Neutral DeFi",
      subtitle: "Every transaction contributes to verified carbon offset projects worldwide",
      image: "🌍"
    },
    {
      title: "Green Energy Tokens",
      subtitle: "Own shares in solar farms, wind projects, and clean energy infrastructure",
      image: "⚡"
    }
  ];

  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Eco-Friendly Investing",
      description: "Direct investment in verified environmental projects with measurable impact",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Renewable Energy RWAs",
      description: "Tokenized solar, wind, and hydroelectric projects with guaranteed returns",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Audited & Secure",
      description: "Smart contracts audited by leading security firms, insurance-backed assets",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Sustainable Yields",
      description: "Competitive APY with environmental impact verification and transparency",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const tokenizedAssets = [
    {
      icon: <Sun className="h-6 w-6" />,
      name: "Solar Farms",
      value: "$12.5M",
      growth: "+15.3%",
      projects: 47,
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Wind className="h-6 w-6" />,
      name: "Wind Energy",
      value: "$8.9M",
      growth: "+22.1%",
      projects: 28,
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      name: "Hydroelectric",
      value: "$6.2M",
      growth: "+18.7%",
      projects: 15,
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: <Battery className="h-6 w-6" />,
      name: "Energy Storage",
      value: "$4.1M",
      growth: "+31.2%",
      projects: 12,
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      name: "Carbon Credits",
      value: "$3.8M",
      growth: "+27.9%",
      projects: 89,
      color: "from-green-500 to-green-600"
    }
  ];

  const roadmapItems = [
    {
      quarter: "Q1 2024",
      title: "Platform Launch",
      status: "completed",
      items: ["Beta platform release", "Initial RWA tokens", "Community building"]
    },
    {
      quarter: "Q2 2024",
      title: "Expansion Phase",
      status: "current",
      items: ["Multi-chain support", "Advanced staking", "Mobile app beta"]
    },
    {
      quarter: "Q3 2024",
      title: "DeFi Integration",
      status: "upcoming",
      items: ["Lending protocols", "Yield farming", "DAO governance"]
    },
    {
      quarter: "Q4 2024",
      title: "Global Scale",
      status: "planned",
      items: ["International assets", "Institutional tools", "Carbon marketplace"]
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Climate Finance Director at UN, PhD in Environmental Economics",
      image: "👩‍💼"
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      bio: "Ex-Ethereum Foundation, 10+ years blockchain development experience",
      image: "👨‍💻"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Sustainability",
      bio: "ESG Investment Specialist, Former Director at Green Climate Fund",
      image: "👩‍🔬"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Former Lead Developer at Aave, Smart Contract Security Expert",
      image: "👨‍🔧"
    }
  ];

  const partnerships = [
    { name: "UN Climate Fund", logo: "🌍", type: "Strategic Partner" },
    { name: "Chainlink", logo: "🔗", type: "Oracle Partner" },
    { name: "Polygon", logo: "🟣", type: "Infrastructure Partner" },
    { name: "Aave", logo: "👻", type: "DeFi Partner" },
    { name: "CarbonChain", logo: "🌿", type: "Verification Partner" },
    { name: "GreenTech Alliance", logo: "⚡", type: "Industry Partner" }
  ];

  const stats = [
    { label: "Total Value Locked", value: "$47.2M", icon: <DollarSign className="h-5 w-5" /> },
    { label: "Active Investors", value: "12,847", icon: <Users className="h-5 w-5" /> },
    { label: "Carbon Offset", value: "2.1M tons", icon: <Leaf className="h-5 w-5" /> },
    { label: "Clean Energy", value: "156 MW", icon: <Zap className="h-5 w-5" /> }
  ];

  // Show loading or redirect if not whitelisted
  if (isConnected && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Checking whitelist status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">RWA.defi</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#assets" className="text-gray-600 hover:text-green-600 transition-colors">Assets</a>
              <a href="#roadmap" className="text-gray-600 hover:text-green-600 transition-colors">Roadmap</a>
              <a href="#team" className="text-gray-600 hover:text-green-600 transition-colors">Team</a>
              {isConnected && isAdmin && (
                <button 
                  onClick={() => router.push('/admin')}
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                >
                  Admin
                </button>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ConnectButton />
              {isConnected && !isLoading && (
                <>
                  {isWhitelisted ? (
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => router.push('/app')}
                    >
                      Launch App
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => router.push('/waitlist')}
                    >
                      Join Waitlist
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <ConnectButton />
              {isConnected && !isLoading && (
                <>
                  {isWhitelisted ? (
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => router.push('/app')}
                    >
                      Launch App
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => router.push('/waitlist')}
                    >
                      Join Waitlist
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>


      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 via-emerald-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-6xl mb-6">{heroSlides[currentSlide].image}</div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                {heroSlides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg">
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2 text-green-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-green-600' : 'bg-green-200'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose RWA.defi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first DeFi platform dedicated to sustainable investing with real environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenized Assets Section */}
      <section id="assets" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tokenized Real-World Assets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invest in verified environmental projects through blockchain-based tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tokenizedAssets.map((asset, index) => (
              <Card key={index} className="border-green-100 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${asset.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {asset.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Value</span>
                      <span className="font-semibold text-gray-900">{asset.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className="font-semibold text-green-600">{asset.growth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Projects</span>
                      <span className="font-semibold text-gray-900">{asset.projects}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start investing in sustainable real-world assets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Wallet</h3>
              <p className="text-gray-600">Connect your Web3 wallet and get whitelisted for platform access</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Assets</h3>
              <p className="text-gray-600">Browse and select from verified environmental projects and RWA tokens</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn & Impact</h3>
              <p className="text-gray-600">Stake your tokens, earn sustainable yields, and track your environmental impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Development Roadmap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our journey to revolutionize sustainable finance through blockchain technology
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {roadmapItems.map((item, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 mr-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-green-600' :
                    item.status === 'current' ? 'bg-blue-600' :
                    item.status === 'upcoming' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  } text-white`}>
                    {item.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                     item.status === 'current' ? <Activity className="h-6 w-6" /> :
                     <Target className="h-6 w-6" />}
                  </div>
                  {index < roadmapItems.length - 1 && (
                    <div className="w-0.5 h-16 bg-green-200 mx-auto mt-4"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full mr-3">
                      {item.quarter}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'current' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <ul className="space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex} className="flex items-center text-gray-600">
                        <ChevronRight className="h-4 w-4 text-green-500 mr-2" />
                        {subItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tokenomics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sustainable token distribution designed for long-term ecosystem growth
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Token Distribution</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                    <span className="font-medium text-gray-900">Community & Ecosystem</span>
                  </div>
                  <span className="font-bold text-gray-900">40%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                    <span className="font-medium text-gray-900">Public Sale</span>
                  </div>
                  <span className="font-bold text-gray-900">25%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                    <span className="font-medium text-gray-900">Team & Advisors</span>
                  </div>
                  <span className="font-bold text-gray-900">20%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-600 rounded-full mr-3"></div>
                    <span className="font-medium text-gray-900">Treasury & Reserves</span>
                  </div>
                  <span className="font-bold text-gray-900">15%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-green-100">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">1B</div>
                    <div className="text-sm text-gray-600">Total Supply</div>
                  </CardContent>
                </Card>
                <Card className="border-blue-100">
                  <CardContent className="p-6 text-center">
                    <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">2%</div>
                    <div className="text-sm text-gray-600">Annual Inflation</div>
                  </CardContent>
                </Card>
                <Card className="border-purple-100">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">15-25%</div>
                    <div className="text-sm text-gray-600">Staking APY</div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-100">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">3 Years</div>
                    <div className="text-sm text-gray-600">Team Vesting</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborating with leading organizations to build the future of sustainable finance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partnerships.map((partner, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{partner.name}</h3>
                  <p className="text-xs text-gray-600">{partner.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals from climate finance, blockchain, and sustainable technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Sustainable Investing?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of investors who are making a positive impact while earning sustainable returns
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <ConnectButton />
            ) : isWhitelisted ? (
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4"
                onClick={() => router.push('/app')}
              >
                Launch App
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4"
                onClick={() => router.push('/waitlist')}
              >
                Join Waitlist
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4">
              Download Whitepaper
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold">RWA.defi</span>
              </div>
              <p className="text-gray-400 mb-6">
                Building the future of sustainable finance through blockchain technology and real-world asset tokenization.
              </p>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tokenized Assets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Staking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Whitepaper</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 RWA.defi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          <a 
            href="#features" 
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-green-600 transition-colors active:bg-gray-50"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium">Features</span>
          </a>
          
          <a 
            href="#assets" 
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-green-600 transition-colors active:bg-gray-50"
            onClick={() => {
              document.getElementById('assets')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Assets</span>
          </a>
          
          <a 
            href="#roadmap" 
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-green-600 transition-colors active:bg-gray-50"
            onClick={() => {
              document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium">Roadmap</span>
          </a>
          
          <a 
            href="#team" 
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-green-600 transition-colors active:bg-gray-50"
            onClick={() => {
              document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Team</span>
          </a>
          
          {isConnected && isAdmin ? (
            <button 
              onClick={() => router.push('/admin')}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-green-600 transition-colors active:bg-gray-50"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Admin</span>
            </button>
          ) : (
            <a 
              href="#" 
              className="flex flex-col items-center justify-center space-y-1 text-gray-400 cursor-not-allowed"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Admin</span>
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}