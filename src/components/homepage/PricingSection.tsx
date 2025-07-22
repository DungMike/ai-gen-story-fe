import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Zap, Crown, Star } from 'lucide-react'

const plans = [
  {
    name: "Free",
    price: "Miễn phí",
    description: "Dành cho người mới bắt đầu",
    features: [
      "5 truyện/tháng",
      "Giọng đọc cơ bản",
      "Lưu trữ 7 ngày",
      "Hỗ trợ cộng đồng"
    ],
    gradient: "from-gray-500 to-gray-600",
    borderColor: "border-gray-600",
    buttonVariant: "outline" as const,
    buttonText: "Bắt đầu miễn phí",
    popular: false
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/tháng",
    description: "Dành cho người dùng chuyên nghiệp",
    features: [
      "50 truyện/tháng",
      "Tất cả giọng đọc AI",
      "Lưu trữ 30 ngày",
      "Dashboard chi tiết",
      "Hỗ trợ ưu tiên",
      "Tùy chỉnh nâng cao"
    ],
    gradient: "from-purple-500 to-blue-600",
    borderColor: "border-purple-500",
    buttonVariant: "default" as const,
    buttonText: "Đăng ký Pro",
    popular: true
  },
  {
    name: "Creator",
    price: "$29.99",
    period: "/tháng",
    description: "Dành cho nhà sáng tạo nội dung",
    features: [
      "Không giới hạn truyện",
      "Tất cả tính năng",
      "Lưu trữ vĩnh viễn",
      "Hỗ trợ ưu tiên",
      "API access",
      "White-label"
    ],
    gradient: "from-orange-500 to-red-600",
    borderColor: "border-orange-500",
    buttonVariant: "outline" as const,
    buttonText: "Đăng ký Creator",
    popular: false
  }
]

export const PricingSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
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
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Chọn gói phù hợp</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Bắt đầu miễn phí,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              nâng cấp khi cần
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Chọn gói phù hợp với nhu cầu của bạn và bắt đầu tạo ra những câu chuyện tuyệt vời
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4 inline mr-2" />
                    Phổ biến nhất
                  </div>
                </motion.div>
              )}

              <Card className={`h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-2 ${plan.borderColor} hover:border-opacity-100 transition-all duration-300 overflow-hidden relative group`}>
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <CardHeader className="text-center relative z-10">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 text-lg ml-1">{plan.period}</span>
                    )}
                  </div>
                  
                  <CardDescription className="text-gray-300 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pt-4"
                  >
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.buttonVariant === 'default'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'
                          : 'border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </motion.div>
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
            <Zap className="w-6 h-6 text-purple-400" />
            <span className="text-purple-300 font-semibold text-lg">
              Không có thẻ tín dụng yêu cầu
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 