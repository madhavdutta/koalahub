import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  BookOpen, 
  Play, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Award,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  Heart,
  Target,
  Rocket,
  Crown,
  Clock,
  Gift,
  DollarSign,
  Percent,
  Timer,
  AlertCircle,
  TrendingDown,
  Lock,
  Unlock,
  Calendar,
  UserCheck,
  Flame,
  Leaf
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  // Countdown timer for scarcity
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: "Course Creation",
      description: "Build stunning courses with our intuitive drag-and-drop builder",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Play,
      title: "Video Integration",
      description: "Seamlessly embed videos from YouTube, Vimeo, or upload directly",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Student Analytics",
      description: "Track progress and engagement with detailed analytics",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Sharing",
      description: "Share courses worldwide with unique, secure links",
      gradient: "from-lime-500 to-green-500"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your educational content",
      gradient: "from-emerald-600 to-green-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for the best learning experience",
      gradient: "from-green-400 to-emerald-400"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Online Educator",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "This platform transformed how I create and share courses. The interface is incredibly intuitive!",
      rating: 5,
      earnings: "$12,500"
    },
    {
      name: "Michael Chen",
      role: "Corporate Trainer",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Amazing analytics and student engagement features. My completion rates increased by 40%!",
      rating: 5,
      earnings: "$8,900"
    },
    {
      name: "Emily Rodriguez",
      role: "Course Creator",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The video integration is seamless. I can focus on content while the platform handles everything else.",
      rating: 5,
      earnings: "$15,200"
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Students", icon: Users },
    { number: "2.5K+", label: "Courses Created", icon: BookOpen },
    { number: "98%", label: "Satisfaction Rate", icon: Heart },
    { number: "150+", label: "Countries Reached", icon: Globe }
  ]

  const pricingFeatures = [
    "Unlimited course creation",
    "Advanced video analytics",
    "Custom branding options",
    "Priority customer support",
    "Advanced student management",
    "Detailed revenue reports",
    "White-label solutions",
    "API access & integrations"
  ]

  const socialProof = [
    { company: "TechCorp", logo: "🏢", students: "2.5K" },
    { company: "EduMax", logo: "🎓", students: "1.8K" },
    { company: "LearnHub", logo: "📚", students: "3.2K" },
    { company: "SkillForge", logo: "⚡", students: "1.9K" }
  ]

  return (
    <div className="min-h-screen">
      {/* Limited Time Offer Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-green-200 animate-pulse" />
              <span>LIMITED TIME: 70% OFF Pro Plan</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Timer className="h-3 w-3" />
              <span className="font-mono">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-100 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-green-100 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-100 rounded-full blur-2xl animate-pulse delay-2000"></div>

        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-2 mb-8">
              <Crown className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Premium Course Builder Platform</span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900">
              Create
              <span className="block gradient-text">
                Extraordinary
              </span>
              Online Courses
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Build, share, and monetize your knowledge with our cutting-edge platform. 
              Join thousands of educators creating impact worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-lg">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg">
                    Start Creating Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
                    <stat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-slate-600 font-medium mb-6">Trusted by leading companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {socialProof.map((company, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-3xl">{company.logo}</div>
                  <div className="font-semibold text-slate-800">{company.company}</div>
                  <div className="text-sm text-slate-600">{company.students} students</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
              <Rocket className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Powerful Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to
              <span className="block gradient-text">succeed online</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our platform provides all the tools and features you need to create, manage, and grow your online education business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group card p-8 hover:scale-105 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories with Earnings */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Success Stories</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Real creators,
              <span className="block gradient-text">real earnings</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See how our creators are building successful online education businesses and generating substantial income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card p-8 animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {testimonial.earnings}/mo
                </div>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-green-400/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
              <Target className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium">Ready to Get Started?</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Start your teaching
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                journey today
              </span>
            </h2>

            <p className="text-xl text-green-100 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of successful educators who have transformed their knowledge into thriving online courses.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 text-lg">
                  Create Your First Course
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 text-lg">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link to="/login" className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 font-semibold rounded-2xl transition-all duration-300 text-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
