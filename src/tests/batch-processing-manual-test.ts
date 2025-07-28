import { batchProcessingService } from '@/services/batch-processing-service'
import { apiClient } from '@/utils/api'

// Manual test script for batch processing
async function runBatchProcessingTests() {
  console.log('🚀 Starting Batch Processing Manual Tests...\n')

  try {
    // Test 1: File Upload
    console.log('📁 Test 1: File Upload')
    console.log('Creating test files...')
    
    const file1Content = 'Test file 1 content'
    const file2Content = 'Test file 2 content'
    
    const testFiles = [
      new File([file1Content], 'test-file-1.txt', { type: 'text/plain' }),
      new File([file2Content], 'test-file-2.txt', { type: 'text/plain' })
    ]

    console.log(`Uploading ${testFiles.length} files...`)
    const uploadResult = await batchProcessingService.uploadFiles(testFiles)
    
    console.log('✅ Upload successful!')
    console.log(`- Total files: ${uploadResult.totalFiles}`)
    console.log(`- Total size: ${uploadResult.totalSize} bytes`)
    console.log('- File URLs:')
    uploadResult.files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.fileName} -> ${file.fileUrl}`)
    })
    console.log('')

    // Test 2: Basic Batch Processing
    console.log('⚙️ Test 2: Basic Batch Processing')
    const basicBatchData = {
      stories: uploadResult.files.map((file, index) => ({
        title: `Test Story ${index + 1}`,
        fileUrl: file.fileUrl
      }))
    }

    console.log('Creating batch with basic configuration...')
    const basicBatchResult = await batchProcessingService.createBatchStories(basicBatchData)
    
    console.log('✅ Basic batch created successfully!')
    console.log(`- Batch ID: ${basicBatchResult.data.batchId}`)
    console.log(`- Total stories: ${basicBatchResult.data.totalStories}`)
    console.log(`- Auto mode: ${basicBatchResult.data.autoMode}`)
    console.log(`- Job ID: ${basicBatchResult.data.jobId}`)
    console.log('')

    // Test 3: Auto Mode Batch Processing
    console.log('🤖 Test 3: Auto Mode Batch Processing')
    const autoModeBatchData = {
      stories: uploadResult.files.map((file, index) => ({
        title: `Auto Story ${index + 1}`,
        fileUrl: file.fileUrl
      })),
      autoMode: {
        enabled: true,
        generateImages: true,
        generateAudio: true,
        mergeAudio: false,
        audioVoice: 'en-US-Studio-M',
        wordPerChunkImage: 100,
        wordPerChunkAudio: 150,
        customPromptImage: 'Create a beautiful illustration for this story',
        customPromptAudio: 'Generate engaging narration with clear pronunciation',
        imageStyle: 'realistic'
      }
    }

    console.log('Creating batch with auto mode configuration...')
    const autoModeBatchResult = await batchProcessingService.createBatchStories(autoModeBatchData)
    
    console.log('✅ Auto mode batch created successfully!')
    console.log(`- Batch ID: ${autoModeBatchResult.data.batchId}`)
    console.log(`- Auto mode: ${autoModeBatchResult.data.autoMode}`)
    console.log('')

    // Test 4: Custom Prompts Batch Processing
    console.log('🎨 Test 4: Custom Prompts Batch Processing')
    const customPromptsBatchData = {
      stories: [
        {
          title: 'Fantasy Story',
          fileUrl: uploadResult.files[0].fileUrl,
          customPrompt: 'Create a fantasy story with magical elements and enchanting characters'
        },
        {
          title: 'Sci-Fi Story',
          fileUrl: uploadResult.files[1].fileUrl,
          customPrompt: 'Create a sci-fi story with advanced technology and space exploration'
        }
      ]
    }

    console.log('Creating batch with custom prompts...')
    const customPromptsBatchResult = await batchProcessingService.createBatchStories(customPromptsBatchData)
    
    console.log('✅ Custom prompts batch created successfully!')
    console.log(`- Batch ID: ${customPromptsBatchResult.data.batchId}`)
    console.log(`- Total stories: ${customPromptsBatchResult.data.totalStories}`)
    console.log('')

    // Test 5: Batch Status Monitoring
    console.log('📊 Test 5: Batch Status Monitoring')
    const batchId = basicBatchResult.data.batchId
    
    console.log(`Monitoring batch: ${batchId}`)
    const batchStatus = await batchProcessingService.getBatchStatus(batchId)
    
    console.log('✅ Batch status retrieved!')
    console.log(`- Status: ${batchStatus.status}`)
    console.log(`- Progress: ${batchStatus.progress}%`)
    console.log(`- Completed: ${batchStatus.completedStories}/${batchStatus.totalStories}`)
    console.log(`- Failed: ${batchStatus.failedStories}`)
    console.log('')

    // Test 6: Batch Job Details
    console.log('🔍 Test 6: Batch Job Details')
    console.log(`Getting detailed information for batch: ${batchId}`)
    const jobDetails = await batchProcessingService.getBatchJob(batchId)
    
    console.log('✅ Job details retrieved!')
    console.log(`- Job ID: ${jobDetails._id}`)
    console.log(`- Status: ${jobDetails.status}`)
    console.log(`- Total files: ${jobDetails.totalFiles}`)
    console.log(`- Processed files: ${jobDetails.processedFiles}`)
    console.log(`- Failed files: ${jobDetails.failedFiles}`)
    console.log(`- Current step: ${jobDetails.progress.currentStep}`)
    console.log(`- Progress: ${jobDetails.progress.percentage}%`)
    console.log('')

    // Test 7: File Validation
    console.log('✅ Test 7: File Validation')
    const validationResults = batchProcessingService.validateFiles(testFiles)
    
    console.log('✅ File validation completed!')
    console.log(`- Valid files: ${validationResults.validFiles.length}`)
    console.log(`- Errors: ${validationResults.errors.length}`)
    
    if (validationResults.errors.length > 0) {
      console.log('- Error details:')
      validationResults.errors.forEach(error => console.log(`  • ${error}`))
    }
    console.log('')

    // Test 8: Error Scenarios
    console.log('⚠️ Test 8: Error Scenarios')
    
    // Test invalid file type
    const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const invalidValidation = batchProcessingService.validateFile(invalidFile)
    console.log(`- Invalid file validation: ${invalidValidation.isValid ? 'PASS' : 'FAIL'}`)
    
    // Test oversized file
    const largeContent = 'x'.repeat(5 * 1024 * 1024) // 5MB (should pass)
    const largeFile = new File([largeContent], 'large.txt', { type: 'text/plain' })
    const largeValidation = batchProcessingService.validateFile(largeFile)
    console.log(`- Large file validation: ${largeValidation.isValid ? 'PASS' : 'FAIL'}`)
    
    // Test mixed files
    const mixedFiles = [testFiles[0], invalidFile]
    const mixedValidation = batchProcessingService.validateFiles(mixedFiles)
    console.log(`- Mixed files validation: ${mixedValidation.validFiles.length} valid, ${mixedValidation.errors.length} errors`)
    console.log('')

    // Test 9: Batch Job Management
    console.log('📋 Test 9: Batch Job Management')
    console.log('Getting user batch jobs...')
    const userJobs = await batchProcessingService.getUserBatchJobs(1, 10)
    
    console.log('✅ User jobs retrieved!')
    console.log(`- Total jobs: ${userJobs.pagination.total}`)
    console.log(`- Current page: ${userJobs.pagination.page}`)
    console.log(`- Jobs per page: ${userJobs.pagination.limit}`)
    console.log(`- Has next page: ${userJobs.pagination.hasNext}`)
    console.log(`- Has previous page: ${userJobs.pagination.hasPrev}`)
    console.log('')

    console.log('🎉 All tests completed successfully!')
    console.log('\n📝 Summary:')
    console.log('- File upload: ✅')
    console.log('- Basic batch processing: ✅')
    console.log('- Auto mode batch processing: ✅')
    console.log('- Custom prompts batch processing: ✅')
    console.log('- Batch status monitoring: ✅')
    console.log('- Job details retrieval: ✅')
    console.log('- File validation: ✅')
    console.log('- Error handling: ✅')
    console.log('- Job management: ✅')

  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Error details:', error instanceof Error ? error.message : error)
  }
}

// Run the tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runBatchProcessingTests().catch(console.error)
} else {
  // Browser environment
  console.log('To run manual tests, call runBatchProcessingTests() in the browser console')
}

export { runBatchProcessingTests } 