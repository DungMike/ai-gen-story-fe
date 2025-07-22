import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Zap, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroSectionProps {
  onCreateStory: () => void
}

export const HeroSection = ({ onCreateStory }: HeroSectionProps) => {
  const floatingIcons = [
    { icon: Sparkles, delay: 0, position: 'top-20 left-10' },
    { icon: Zap, delay: 0.5, position: 'top-40 right-20' },
    { icon: Cpu, delay: 1, position: 'bottom-20 left-20' },
    { icon: Sparkles, delay: 1.5, position: 'bottom-40 right-10' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      {/* Floating AI Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position} text-purple-400/30`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            y: [0, -20, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <item.icon className="w-8 h-8" />
        </motion.div>
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">AI-Powered Story Generation</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Biến văn bản
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              thành thế giới
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              sống động
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Tự động tạo hình ảnh minh họa và giọng đọc truyền cảm từ truyện của bạn.
            <br />
            <span className="text-purple-300 font-semibold">
              Biến ý tưởng thành hiện thực chỉ trong vài giây.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onCreateStory}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-2xl shadow-purple-500/25 border-0"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Dùng thử miễn phí
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 rounded-xl border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 backdrop-blur-sm"
              >
                <Play className="mr-3 h-6 w-6" />
                Xem mẫu truyện
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-12 mt-16"
          >
            {[
              { label: 'Người dùng', value: '10,000+', color: 'text-purple-400' },
              { label: 'Truyện đã tạo', value: '50,000+', color: 'text-blue-400' },
              { label: 'Uptime', value: '99.9%', color: 'text-cyan-400' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-purple-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
} 