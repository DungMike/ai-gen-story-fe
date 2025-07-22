import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Sparkles, Music, Image, FileText, ArrowRight, Play, Users, Zap, LogOut, User, Menu, X, Star, Check, ExternalLink, Github, MessageCircle, Facebook } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { motion, AnimatePresence } from 'framer-motion'

function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const testimonials = [
    {
      name: "Nguyễn Văn An",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Tuyệt vời! AI tạo ra những hình ảnh minh họa đẹp mắt và giọng đọc tự nhiên. Con tôi rất thích nghe truyện được tạo ra.",
      rating: 5
    },
    {
      name: "Trần Thị Bình",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Công cụ này giúp tôi tiết kiệm rất nhiều thời gian. Chỉ cần upload file txt là có ngay truyện với hình ảnh và audio.",
      rating: 5
    },
    {
      name: "Lê Hoàng Cường",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Giao diện đẹp, dễ sử dụng. Hỗ trợ nhiều giọng đọc khác nhau rất tiện lợi cho việc tạo nội dung.",
      rating: 4
    },
    {
      name: "Phạm Thị Dung",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Dashboard thống kê chi tiết giúp tôi theo dõi việc sử dụng rất tốt. Rất hài lòng với dịch vụ.",
      rating: 5
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    
    setIsProcessing(true)
    // TODO: Implement file upload logic
    setTimeout(() => {
      setIsProcessing(false)
      navigate('/create-story')
    }, 2000)
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleCreateStory = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    navigate('/create-story')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-white font-bold text-sm">AI</span>
              </motion.div>
              <span className="text-xl font-bold text-gradient">Story Generator</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/batch" className="text-sm font-medium hover:text-primary transition-colors">
                Batch Processing
              </Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              {isAuthenticated && (
                <Link to="/create-story" className="text-sm font-medium hover:text-primary transition-colors">
                  Create Story
                </Link>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user?.username || 'User'}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-2"
              >
                <Link to="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/batch" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  Batch Processing
                </Link>
                <Link to="/dashboard" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {isAuthenticated && (
                  <Link to="/create-story" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                    Create Story
                  </Link>
                )}
                {isAuthenticated ? (
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 py-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{user?.username || 'User'}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2 border-t space-y-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="w-full justify-start">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gradient leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Biến văn bản thành thế giới
            <br />
            <span className="text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              sống động với AI
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Tự động tạo hình ảnh minh họa và giọng đọc truyền cảm từ truyện của bạn. 
            Biến ý tưởng thành hiện thực chỉ trong vài giây.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={handleCreateStory}
              >
                Dùng thử miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Xem mẫu truyện
            </Button>
          </motion.div>
        </motion.div>

        {/* AI Features Showcase */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-hover border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur h-full">
              <CardHeader>
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <CardTitle className="text-xl">Tạo truyện từ file .txt</CardTitle>
                <CardDescription className="text-base">
                  Upload file văn bản và để AI tự động tạo ra những câu chuyện hấp dẫn với nhiều phong cách khác nhau.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="card-hover border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur h-full">
              <CardHeader>
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image className="w-6 h-6 text-green-600 dark:text-green-400" />
                </motion.div>
                <CardTitle className="text-xl">Sinh ảnh minh họa AI</CardTitle>
                <CardDescription className="text-base">
                  Tự động tạo ra những hình ảnh minh họa đẹp mắt phù hợp với nội dung truyện của bạn.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="card-hover border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur h-full">
              <CardHeader>
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <CardTitle className="text-xl">Giọng đọc AI đa dạng</CardTitle>
                <CardDescription className="text-base">
                  Chọn từ nhiều giọng đọc AI: Zephyr, Leda, Charon và nhiều giọng khác với chất lượng cao.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.div 
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">10,000+</div>
            <div className="text-sm text-muted-foreground">Người dùng hài lòng</div>
          </motion.div>
          <motion.div 
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">50,000+</div>
            <div className="text-sm text-muted-foreground">Truyện đã tạo</div>
          </motion.div>
          <motion.div 
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-muted-foreground">Thời gian hoạt động</div>
          </motion.div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Chọn gói phù hợp với bạn</h2>
            <p className="text-lg text-muted-foreground">Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700 h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <div className="text-3xl font-bold">Miễn phí</div>
                  <CardDescription>Dành cho người mới bắt đầu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">5 truyện/tháng</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Giọng đọc cơ bản</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lưu trữ 7 ngày</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Bắt đầu miễn phí
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-2 border-blue-500 dark:border-blue-400 h-full relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Phổ biến
                  </span>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <div className="text-3xl font-bold">$9.99<span className="text-sm font-normal">/tháng</span></div>
                  <CardDescription>Dành cho người dùng chuyên nghiệp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">50 truyện/tháng</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Tất cả giọng đọc AI</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lưu trữ 30 ngày</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Dashboard chi tiết</span>
                    </li>
                  </ul>
                  <Button className="w-full">
                    Đăng ký Pro
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Creator Plan */}
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700 h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Creator</CardTitle>
                  <div className="text-3xl font-bold">$29.99<span className="text-sm font-normal">/tháng</span></div>
                  <CardDescription>Dành cho nhà sáng tạo nội dung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Không giới hạn truyện</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Tất cả tính năng</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lưu trữ vĩnh viễn</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Hỗ trợ ưu tiên</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Đăng ký Creator
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Người dùng nói gì về chúng tôi</h2>
            <p className="text-lg text-muted-foreground">Những đánh giá từ cộng đồng người dùng</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-lg p-8 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-lg italic">"{testimonials[currentTestimonial].content}"</p>
            </motion.div>
            
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Preview Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Dashboard chuyên nghiệp</h2>
            <p className="text-lg text-muted-foreground">Theo dõi và quản lý tất cả hoạt động của bạn</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Image className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-muted-foreground">Hình ảnh đã tạo</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Music className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">567</div>
                    <div className="text-sm text-muted-foreground">Audio đã tạo</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">89,123</div>
                    <div className="text-sm text-muted-foreground">Token đã sử dụng</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button size="lg" className="text-lg px-8 py-3">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Xem demo Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Đội ngũ hỗ trợ</h2>
            <p className="text-lg text-muted-foreground">Luôn sẵn sàng hỗ trợ bạn 24/7</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Support</h3>
              <p className="text-muted-foreground">Hỗ trợ tự động 24/7 với AI thông minh</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Founder</h3>
              <p className="text-muted-foreground">Phản hồi nhanh trong 24h, hỗ trợ tiếng Việt & Anh</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 mx-auto mb-4 flex items-center justify-center">
                <Github className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dev Team</h3>
              <p className="text-muted-foreground">Cập nhật liên tục và cải thiện tính năng</p>
            </motion.div>
          </div>
        </motion.div>

        {/* File Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <FileText className="w-6 h-6" />
                <span>Thử ngay bây giờ</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Upload file .txt để trải nghiệm AI-powered story transformation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Kéo thả file truyện vào đây, hoặc click để chọn file
                </p>
                <Input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Chọn File</span>
                  </Button>
                </label>
              </motion.div>
              
              {selectedFile && (
                <motion.div 
                  className="p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium">File đã chọn: {selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Kích thước: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Đang xử lý...' : 'Bắt đầu xử lý'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center space-y-6 py-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <h2 className="text-3xl font-bold">Sẵn sàng biến đổi truyện của bạn?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người dùng đang tạo ra nội dung tuyệt vời với AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Tạo tài khoản miễn phí
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">Story Generator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Biến văn bản thành thế giới sống động với AI
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Sản phẩm</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary">Tạo truyện</Link></li>
                <li><Link to="/batch" className="hover:text-primary">Batch Processing</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
                <li><Link to="/docs" className="hover:text-primary">Tài liệu</Link></li>
                <li><Link to="/api" className="hover:text-primary">API</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Theo dõi</h3>
              <div className="flex space-x-4">
                <Link to="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-primary">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-primary">
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Story Generator. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Điều khoản
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Chính sách
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage 