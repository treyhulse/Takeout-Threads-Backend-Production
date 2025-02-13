"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { createStore } from "@/lib/supabase/stores"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  subdomain: z.string().min(1, "Subdomain is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Subdomain can only contain letters, numbers, and hyphens"),
  domain: z.string().optional(),
  slogan: z.string().optional(),
})

export function StoreModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subdomain: "",
      domain: "",
      slogan: "",
    },
  })

  // Watch the name field outside useEffect
  const storeName = form.watch("name")

  // Generate subdomain from store name
  useEffect(() => {
    const subdomain = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric chars with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
    
    form.setValue("subdomain", subdomain)
  }, [storeName, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const { data, error } = await createStore(values)

      if (error) {
        throw new Error(error)
      }

      toast.success("Store created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Site
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Create a new store for your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain</FormLabel>
                  <FormControl>
                    <Input placeholder="my-store" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your site will be available at {field.value || "your-subdomain"}.takeout-threads.app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Domain (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="www.mystore.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your custom domain if you want to use one
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your store's slogan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Store"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 