import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Github, MessageCircle, Facebook, Sparkles, ExternalLink } from 'lucide-react'

export const ModernFooter = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 border-t border-slate-700/50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  AI Story
                </span>
                <span className="text-xs text-purple-300 font-medium">Generator</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Biến văn bản thành thế giới sống động với AI. Tạo ra những câu chuyện tuyệt vời chỉ trong vài giây.
            </p>
          </motion.div>
          
          {/* Product Links */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white text-lg">Sản phẩm</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-purple-300 transition-colors">
                  Tạo truyện
                </Link>
              </li>
              <li>
                <Link to="/batch" className="hover:text-purple-300 transition-colors">
                  Batch Processing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-purple-300 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-purple-300 transition-colors flex items-center">
                  API
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Support Links */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white text-lg">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-purple-300 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-purple-300 transition-colors">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-purple-300 transition-colors">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-purple-300 transition-colors">
                  Trạng thái hệ thống
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white text-lg">Theo dõi</h3>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-400 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-400 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-400 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-400">
            © 2024 AI Story Generator. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-gray-400 hover:text-purple-300 transition-colors">
              Điều khoản
            </Link>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-purple-300 transition-colors">
              Chính sách
            </Link>
            <Link to="/cookies" className="text-sm text-gray-400 hover:text-purple-300 transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 