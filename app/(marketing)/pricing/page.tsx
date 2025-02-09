import PricingTable from "@/components/PricingTable";

export default function PricingPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h1>
      <PricingTable />
    </div>
  );
}
