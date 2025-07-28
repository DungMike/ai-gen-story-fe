import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Sparkles, Image, Volume2, FileText, Loader2 } from 'lucide-react'

export interface StoryConfig {
  title?: string
  customPrompt?: string
  fileUrl: string
}

export interface AutoModeConfig {
  enabled: boolean
  generateImages?: boolean
  generateAudio?: boolean
  mergeAudio?: boolean
  audioVoice?: string
  wordPerChunkImage?: number
  wordPerChunkAudio?: number
  customPromptImage?: string
  customPromptAudio?: string
  imageStyle?: string
}

export interface BatchConfigFormData {
  stories: StoryConfig[]
  autoMode?: AutoModeConfig
}

interface BatchConfigFormProps {
  uploadedFiles: Array<{
    id: string
    fileName: string
    fileUrl: string
  }>
  onSubmit: (data: BatchConfigFormData) => void
  isSubmitting?: boolean
}

const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'anime', label: 'Anime' },
  { value: 'comic', label: 'Comic' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'oil-painting', label: 'Oil Painting' },
  { value: 'digital-art', label: 'Digital Art' }
]

const AUDIO_VOICES = [
  { value: 'Achird', label: 'Achird' },
  { value: 'Google TTS', label: 'Google TTS' },
  { value: 'ElevenLabs', label: 'ElevenLabs' }
]

export const BatchConfigForm: React.FC<BatchConfigFormProps> = ({
  uploadedFiles,
  onSubmit,
  isSubmitting = false
}) => {
  const [autoModeEnabled, setAutoModeEnabled] = useState(true)
  const [generateImages, setGenerateImages] = useState(true)
  const [generateAudio, setGenerateAudio] = useState(true)
  const [mergeAudio, setMergeAudio] = useState(true)
  const [audioVoice, setAudioVoice] = useState('Achird')
  const [wordPerChunkImage, setWordPerChunkImage] = useState(500)
  const [wordPerChunkAudio, setWordPerChunkAudio] = useState(500)
  const [customPromptImage, setCustomPromptImage] = useState('')
  const [customPromptAudio, setCustomPromptAudio] = useState('')
  const [imageStyle, setImageStyle] = useState('realistic')
  
  const [storyConfigs, setStoryConfigs] = useState<StoryConfig[]>(
    uploadedFiles.map(file => ({
      title: file.fileName.replace(/\.[^/.]+$/, ''), // Remove file extension
      customPrompt: '',
      fileUrl: file.fileUrl
    }))
  )

  const handleStoryConfigChange = (index: number, field: keyof StoryConfig, value: string) => {
    const updatedConfigs = [...storyConfigs]
    updatedConfigs[index] = { ...updatedConfigs[index], [field]: value }
    setStoryConfigs(updatedConfigs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData: BatchConfigFormData = {
      stories: storyConfigs,
      autoMode: autoModeEnabled ? {
        enabled: true,
        generateImages,
        generateAudio,
        mergeAudio,
        audioVoice,
        wordPerChunkImage,
        wordPerChunkAudio,
        customPromptImage: customPromptImage || undefined,
        customPromptAudio: customPromptAudio || undefined,
        imageStyle
      } : undefined
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stories Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Stories Configuration
          </CardTitle>
          <CardDescription>
            Configure individual story settings for each uploaded file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {storyConfigs.map((config, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">{uploadedFiles[index].fileName}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Story Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={config.title || ''}
                    onChange={(e) => handleStoryConfigChange(index, 'title', e.target.value)}
                    placeholder="Enter story title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`customPrompt-${index}`}>Custom Prompt (Optional)</Label>
                  <Textarea
                    id={`customPrompt-${index}`}
                    value={config.customPrompt || ''}
                    onChange={(e) => handleStoryConfigChange(index, 'customPrompt', e.target.value)}
                    placeholder="Enter custom prompt for story generation"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Auto Mode Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Auto Mode Configuration
          </CardTitle>
          <CardDescription>
            Configure automatic story generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoMode"
              checked={autoModeEnabled}
              onCheckedChange={(checked) => setAutoModeEnabled(checked as boolean)}
            />
            <Label htmlFor="autoMode" className="text-base font-medium">
              Enable Auto Mode
            </Label>
          </div>

          {autoModeEnabled && (
            <div className="space-y-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
              {/* Generation Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Generation Options
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateImages"
                      checked={generateImages}
                      onCheckedChange={(checked) => setGenerateImages(checked as boolean)}
                    />
                    <Label htmlFor="generateImages" className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Generate Images
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateAudio"
                      checked={generateAudio}
                      onCheckedChange={(checked) => setGenerateAudio(checked as boolean)}
                    />
                    <Label htmlFor="generateAudio" className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Generate Audio
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mergeAudio"
                      checked={mergeAudio}
                      onCheckedChange={(checked) => setMergeAudio(checked as boolean)}
                    />
                    <Label htmlFor="mergeAudio" className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Merge Audio Files
                    </Label>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              {generateAudio && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Audio Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audioVoice">Audio Voice</Label>
                      <Select value={audioVoice} onValueChange={setAudioVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {AUDIO_VOICES.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value}>
                              {voice.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wordPerChunkAudio">Words per Chunk (Audio)</Label>
                      <Input
                        id="wordPerChunkAudio"
                        type="number"
                        value={wordPerChunkAudio}
                        onChange={(e) => setWordPerChunkAudio(Number(e.target.value))}
                        min={50}
                        max={2000}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customPromptAudio">Custom Audio Prompt (Optional)</Label>
                    <Textarea
                      id="customPromptAudio"
                      value={customPromptAudio}
                      onChange={(e) => setCustomPromptAudio(e.target.value)}
                      placeholder="Enter custom prompt for audio generation"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Image Settings */}
              {generateImages && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Image Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageStyle">Image Style</Label>
                      <Select value={imageStyle} onValueChange={setImageStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {IMAGE_STYLES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wordPerChunkImage">Words per Chunk (Images)</Label>
                      <Input
                        id="wordPerChunkImage"
                        type="number"
                        value={wordPerChunkImage}
                        onChange={(e) => setWordPerChunkImage(Number(e.target.value))}
                        min={50}
                        max={2000}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customPromptImage">Custom Image Prompt (Optional)</Label>
                    <Textarea
                      id="customPromptImage"
                      value={customPromptImage}
                      onChange={(e) => setCustomPromptImage(e.target.value)}
                      placeholder="Enter custom prompt for image generation"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating Stories...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Stories
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 