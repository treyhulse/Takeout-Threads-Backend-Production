import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrganizationInfoProps {
  orgDetails: Record<string, any>;
}

export function OrganizationInfo({ orgDetails }: OrganizationInfoProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(orgDetails).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium capitalize">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-sm">
                {value ? value.toString() : "-"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 