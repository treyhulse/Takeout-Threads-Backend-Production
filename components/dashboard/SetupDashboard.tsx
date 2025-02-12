"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Users, UserPlus, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

const setupSteps = [
  {
    title: "Add your first product",
    description: "Start selling by adding your first product or import from Shopify & Square",
    icon: Package,
    href: "/dashboard/items",
    color: "text-blue-500"
  },
  {
    title: "Add your first customer",
    description: "Start building your customer base",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-green-500"
  },
  {
    title: "Invite team members",
    description: "Collaborate with your team",
    icon: UserPlus,
    href: "/dashboard/organization",
    color: "text-purple-500"
  },
  {
    title: "Launch your store",
    description: "Review your setup and go live",
    icon: Rocket,
    href: "/dashboard/stores",
    color: "text-orange-500"
  }
];

export function SetupDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Setup your store</h2>
        <p className="text-muted-foreground">Complete these steps to get started</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {setupSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={step.href}>
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-muted ${step.color}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 