import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Music, Zap, ExternalLink, TrendingUp, Users, FileText } from 'lucide-react'

export const DashboardPreviewSection = () => {
  const stats = [
    {
      icon: Image,
      value: "1,234",
      label: "Hình ảnh đã tạo",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Music,
      value: "567",
      label: "Audio đã tạo",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: Zap,
      value: "89,123",
      label: "Token đã sử dụng",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30"
    }
  ]

  const recentActivities = [
    { type: "image", title: "Truyện cổ tích", time: "2 phút trước", status: "completed" },
    { type: "audio", title: "Truyện phiêu lưu", time: "5 phút trước", status: "processing" },
    { type: "image", title: "Truyện khoa học", time: "10 phút trước", status: "completed" },
    { type: "audio", title: "Truyện giáo dục", time: "15 phút trước", status: "completed" }
  ]

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
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
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Dashboard chuyên nghiệp</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Theo dõi và quản lý
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              tất cả hoạt động
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Dashboard hiện đại giúp bạn theo dõi chi tiết mọi hoạt động và tối ưu hóa việc sử dụng
          </motion.p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
            <CardContent className="p-8">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`text-center p-6 rounded-xl backdrop-blur-sm border ${stat.borderColor} ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activities */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'image' ? 'bg-blue-500/20' : 'bg-green-500/20'
                        }`}>
                          {activity.type === 'image' ? (
                            <Image className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Music className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {activity.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  viewport={{ once: true }}
                  className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Tạo truyện mới</span>
                  </div>
                  <p className="text-sm text-gray-400">Bắt đầu tạo truyện với AI</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.9 }}
                  viewport={{ once: true }}
                  className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">Quản lý dự án</span>
                  </div>
                  <p className="text-sm text-gray-400">Tổ chức và quản lý dự án</p>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-3 rounded-xl border-0 shadow-lg shadow-purple-500/25"
                  >
                    <ExternalLink className="mr-3 h-6 w-6" />
                    Xem demo Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 