import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function BatchProcessingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Processing</CardTitle>
          <CardDescription>Process multiple files at once</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Batch processing interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default BatchProcessingPage 