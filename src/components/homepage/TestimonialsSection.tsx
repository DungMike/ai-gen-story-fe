import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: "Nguyễn Văn An",
    role: "Nhà văn",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "Tuyệt vời! AI tạo ra những hình ảnh minh họa đẹp mắt và giọng đọc tự nhiên. Con tôi rất thích nghe truyện được tạo ra.",
    rating: 5
  },
  {
    name: "Trần Thị Bình",
    role: "Giáo viên",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "Công cụ này giúp tôi tiết kiệm rất nhiều thời gian. Chỉ cần upload file txt là có ngay truyện với hình ảnh và audio.",
    rating: 5
  },
  {
    name: "Lê Hoàng Cường",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "Giao diện đẹp, dễ sử dụng. Hỗ trợ nhiều giọng đọc khác nhau rất tiện lợi cho việc tạo nội dung.",
    rating: 4
  },
  {
    name: "Phạm Thị Dung",
    role: "Nhà phát triển",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "Dashboard thống kê chi tiết giúp tôi theo dõi việc sử dụng rất tốt. Rất hài lòng với dịch vụ.",
    rating: 5
  },
  {
    name: "Hoàng Văn Minh",
    role: "Doanh nhân",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    content: "Chất lượng AI vượt trội, tốc độ xử lý nhanh. Đây là công cụ không thể thiếu cho việc tạo nội dung.",
    rating: 5
  }
]

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-6"
          >
            <Quote className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Đánh giá từ người dùng</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Người dùng nói gì
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              về chúng tôi
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Những đánh giá chân thực từ cộng đồng người dùng đang sử dụng AI Story Generator
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto relative">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Testimonial Card */}
          <div className="relative h-96 flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 h-full flex flex-col justify-center">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-purple-400/30">
                    <Quote className="w-12 h-12" />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-6">
                    {/* Rating */}
                    <div className="flex justify-center space-x-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-xl md:text-2xl text-gray-200 leading-relaxed italic">
                      "{testimonials[currentIndex].content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-white text-lg">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-purple-300 text-sm">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: 'Đánh giá trung bình', value: '4.8/5', color: 'text-yellow-400' },
            { label: 'Người dùng hài lòng', value: '98%', color: 'text-green-400' },
            { label: 'Đánh giá tích cực', value: '10,000+', color: 'text-purple-400' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl"
            >
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 