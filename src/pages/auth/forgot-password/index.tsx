import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Password reset form coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage 