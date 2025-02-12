"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createStore } from "@/lib/supabase/stores";
import { createItem } from "@/lib/supabase/items";
import { useToast } from "@/hooks/use-toast";
import { createOrganization } from "@/lib/kinde/actions/organization";

type OnboardingStep = "org" | "store" | "item";
type LoadingStep = "org" | "website" | "item" | "customer" | "order" | "complete";

export function OrganizationOnboarding({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<OnboardingStep>("org");
  const [loadingStep, setLoadingStep] = useState<LoadingStep | null>(null);
  const [orgName, setOrgName] = useState("");
  const [storeData, setStoreData] = useState({
    name: "",
    subdomain: "",
    slogan: "",
  });
  const [itemData, setItemData] = useState({
    name: "",
    sku: "",
    type: "PHYSICAL",
    unit_of_measure: "PIECE",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const { user } = useKindeAuth();

  const runLoadingSequence = async () => {
    const steps: LoadingStep[] = ["org", "website", "item", "customer", "order", "complete"];
    const delay = 1000; // 1 second delay between each step

    for (const step of steps) {
      setLoadingStep(step);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const handleOrgCreation = async () => {
    try {
      setIsLoading(true);
      
      // Start the loading sequence
      runLoadingSequence();
      
      const result = await createOrganization(orgName, {
        user_id: user?.id
      });
      
      if (result.error || !result.org_code) {
        setLoadingStep(null);
        toast({
          title: "Error",
          description: result.error || "Failed to create organization",
          variant: "destructive",
        });
        return;
      }

      // Wait for the loading sequence to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      router.push(`/api/auth/login?org_code=${result.org_code}&post_login_redirect_url=/dashboard`);
      onClose();
    } catch (error) {
      setLoadingStep(null);
      console.error("Organization creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreCreation = async () => {
    const result = await createStore(storeData);
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to create store",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleItemCreation = async () => {
    const result = await createItem(itemData);
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step === "store") {
      const success = await handleStoreCreation();
      if (success) setStep("item");
    } else if (step === "item") {
      const success = await handleItemCreation();
      if (success) {
        toast({
          title: "Success",
          description: "Organization setup completed!",
        });
        router.push("/dashboard");
        onClose();
      }
    }
  };

  const LoadingState = () => {
    const steps: LoadingStep[] = ["org", "website", "item", "customer", "order", "complete"];
    const currentStepIndex = steps.indexOf(loadingStep!);

    return (
      <div className="flex flex-col space-y-6 py-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  index <= currentStepIndex
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-0.5 h-6 -translate-x-1/2 ${
                    index < currentStepIndex
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`text-sm ${
                index === currentStepIndex
                  ? "text-primary font-medium"
                  : index < currentStepIndex
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {step === "org" && "Creating your organization"}
              {step === "website" && "Creating your website"}
              {step === "item" && "Creating your first item"}
              {step === "customer" && "Creating your first customer"}
              {step === "order" && "Creating your first order"}
              {step === "complete" && "Almost there"}
            </span>
            {index <= currentStepIndex && index !== steps.length - 1 && (
              <div className="ml-2 w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {loadingStep ? "Setting up your workspace" : (
              step === "org"
                ? "Create Organization"
                : step === "store"
                ? "Set Up Your Store"
                : "Add Your First Item"
            )}
          </DialogTitle>
          <DialogDescription>
            {!loadingStep && (
              step === "org"
                ? "Start by naming your organization"
                : step === "store"
                ? "Configure your store details"
                : "Add your first product or item"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {loadingStep ? (
            <LoadingState />
          ) : (
            <>
              {step === "org" && (
                <div className="space-y-4">
                  <Input
                    placeholder="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOrgCreation}
                      disabled={!orgName || orgName.trim() === "" || isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Organization"}
                    </Button>
                  </div>
                </div>
              )}

              {step === "store" && (
                <div className="space-y-4">
                  <Input
                    placeholder="Store Name"
                    value={storeData.name}
                    onChange={(e) =>
                      setStoreData({ ...storeData, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Subdomain"
                    value={storeData.subdomain}
                    onChange={(e) =>
                      setStoreData({ ...storeData, subdomain: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Slogan (optional)"
                    value={storeData.slogan}
                    onChange={(e) =>
                      setStoreData({ ...storeData, slogan: e.target.value })
                    }
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setStep("org")}>
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!storeData.name || !storeData.subdomain}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === "item" && (
                <div className="space-y-4">
                  <Input
                    placeholder="Item Name"
                    value={itemData.name}
                    onChange={(e) =>
                      setItemData({ ...itemData, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="SKU"
                    value={itemData.sku}
                    onChange={(e) =>
                      setItemData({ ...itemData, sku: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={itemData.description}
                    onChange={(e) =>
                      setItemData({ ...itemData, description: e.target.value })
                    }
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setStep("store")}>
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!itemData.name || !itemData.sku}
                    >
                      Complete Setup
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 