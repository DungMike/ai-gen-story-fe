import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Profile management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage 