import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ViewWebsiteCard } from "@/components/dashboard/ViewWebsiteCard";
import { SetupDashboard } from "@/components/dashboard/SetupDashboard";
import { getStores } from "@/lib/supabase/stores";

export default async function DashboardPage() {
  const { getOrganization, getUser } = getKindeServerSession();
  const org = await getOrganization();
  const user = await getUser();
  
  if (!org?.orgCode) {
    return null;
  }

  const { data: stores } = await getStores();
  const primaryStore = stores?.[0];

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome, {user.given_name}!</h1>
        <p className="text-muted-foreground">
          Manage your store, products, and more from your dashboard.
        </p>
      </div>

      {/* View Website Card */}
      {primaryStore && (
        <ViewWebsiteCard 
          storeName={primaryStore.name}
          subdomain={primaryStore.subdomain}
          storeId={primaryStore.id}
          logoUrl={primaryStore.store_logo_url}
        />
      )}
      
      <SetupDashboard />
    </div>
  );
}
