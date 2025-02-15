import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.picture || ""} alt={user.given_name || ""} />
              <AvatarFallback>
                {user.given_name?.[0]}
                {user.family_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {user.given_name} {user.family_name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">User ID</h3>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Email Verified</h3>
              <p className="text-sm text-muted-foreground">
                {user.email ? "Yes" : "No"}
              </p>
            </div>
            <div>
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-sm text-muted-foreground"> 
                    {user.properties?.email_verified
                        ? user.properties.email_verified
                        : "N/A"}
                </p>
            </div>
            <div>
                <h3 className="font-medium mb-2">Job Title</h3>
                <p className="text-sm text-muted-foreground"> 
                    {user.properties?.job_title
                        ? user.properties.job_title
                        : "N/A"}
                </p>
            </div>
            <div>
                <h3 className="font-medium mb-2">Last Sign In</h3>
                <p className="text-sm text-muted-foreground">
                    {user.properties?.last_login
                        ? new Date(user.properties.last_login).toLocaleDateString()
                        : "N/A"}
                </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
