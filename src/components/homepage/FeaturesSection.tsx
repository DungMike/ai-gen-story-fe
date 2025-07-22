import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image, Music, Sparkles, Zap, Cpu, Brain, Palette } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: "Tạo truyện từ file .txt",
    description: "Upload file văn bản và để AI tự động tạo ra những câu chuyện hấp dẫn với nhiều phong cách khác nhau.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400"
  },
  {
    icon: Image,
    title: "Sinh ảnh minh họa AI",
    description: "Tự động tạo ra những hình ảnh minh họa đẹp mắt phù hợp với nội dung truyện của bạn.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400"
  },
  {
    icon: Music,
    title: "Giọng đọc AI đa dạng",
    description: "Chọn từ nhiều giọng đọc AI: Zephyr, Leda, Charon và nhiều giọng khác với chất lượng cao.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400"
  },
  {
    icon: Brain,
    title: "AI thông minh",
    description: "Sử dụng công nghệ AI tiên tiến để hiểu và xử lý nội dung một cách thông minh.",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400"
  },
  {
    icon: Palette,
    title: "Tùy chỉnh phong cách",
    description: "Chọn từ nhiều phong cách nghệ thuật và giọng đọc để phù hợp với nhu cầu của bạn.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    iconColor: "text-indigo-400"
  },
  {
    icon: Zap,
    title: "Xử lý nhanh chóng",
    description: "Tạo ra nội dung chất lượng cao chỉ trong vài giây với công nghệ AI tối ưu.",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400"
  }
]

export const FeaturesSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
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
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Tính năng nổi bật</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Sức mạnh của
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              AI thông minh
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Khám phá những tính năng AI tiên tiến giúp biến ý tưởng của bạn thành hiện thực
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                <CardHeader className="relative">
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Icon Container */}
                  <motion.div
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>

                  <CardTitle className="text-xl font-bold text-white mb-3 relative z-10">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-8 py-4"
          >
            <Cpu className="w-6 h-6 text-purple-400" />
            <span className="text-purple-300 font-semibold text-lg">
              Khám phá thêm tính năng AI
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 