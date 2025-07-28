#!/usr/bin/env node

import { runBatchProcessingTests } from './batch-processing-manual-test'

// Test runner for batch processing
async function runAllTests() {
  console.log('🧪 Batch Processing Test Suite')
  console.log('================================\n')

  // Run manual tests
  try {
    await runBatchProcessingTests()
  } catch (error) {
    console.error('❌ Manual tests failed:', error)
    process.exit(1)
  }

  console.log('\n✅ All tests completed!')
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error)
    process.exit(1)
  })
}

export { runAllTests } 