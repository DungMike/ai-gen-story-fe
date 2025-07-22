import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, FileText, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface FileUploadSectionProps {
  selectedFile: File | null
  isProcessing: boolean
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
}

export const FileUploadSection = ({
  selectedFile,
  isProcessing,
  onFileSelect,
  onUpload
}: FileUploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      // Create a synthetic event for the file input
      const syntheticEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      onFileSelect(syntheticEvent)
    }
  }

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
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Thử ngay bây giờ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Bắt đầu tạo truyện
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              ngay hôm nay
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Upload file .txt để trải nghiệm sức mạnh của AI trong việc tạo truyện
          </motion.p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
            <CardHeader className="text-center relative">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <CardTitle className="flex items-center justify-center space-x-3 text-2xl relative z-10">
                <FileText className="w-8 h-8 text-purple-400" />
                <span className="text-white">Upload File</span>
              </CardTitle>
              <CardDescription className="text-lg text-gray-300 relative z-10">
                Kéo thả file truyện vào đây, hoặc click để chọn file
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-600 hover:border-purple-500/50 hover:bg-purple-500/5'
                }`}
              >
                <motion.div
                  animate={{ 
                    y: isDragOver ? -5 : 0,
                    scale: isDragOver ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                </motion.div>
                
                <p className="text-gray-300 mb-4">
                  Kéo thả file truyện vào đây, hoặc click để chọn file
                </p>
                
                <p className="text-sm text-gray-500 mb-6">
                  Hỗ trợ: .txt, .doc, .docx (Tối đa 10MB)
                </p>

                <Input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={onFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Chọn File
                  </Button>
                </label>
              </motion.div>

              {/* Selected File Info */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        File đã chọn: {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Kích thước: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onUpload}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-4 rounded-xl border-0 shadow-lg shadow-purple-500/25"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-6 w-6" />
                      Bắt đầu xử lý
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { icon: Sparkles, title: "AI Thông minh", desc: "Xử lý nội dung tự động" },
            { icon: Zap, title: "Tốc độ cao", desc: "Kết quả trong vài giây" },
            { icon: FileText, title: "Định dạng đa dạng", desc: "Hỗ trợ nhiều loại file" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl"
            >
              <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 