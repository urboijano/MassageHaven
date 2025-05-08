import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Settings as SettingsType } from "@shared/schema";

// Form schema for settings
const settingsFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  description: z.string().optional(),
  
  mondayToFridayOpen: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  mondayToFridayClose: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  mondayToFridayEnabled: z.boolean().default(true),
  
  saturdayOpen: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  saturdayClose: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  saturdayEnabled: z.boolean().default(true),
  
  sundayOpen: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  sundayClose: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  sundayEnabled: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();

  // Fetch settings
  const { data: settings, isLoading } = useQuery<SettingsType>({
    queryKey: ["/api/settings"],
  });

  // Form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      businessName: "",
      contactEmail: "",
      phone: "",
      address: "",
      description: "",
      mondayToFridayOpen: "09:00",
      mondayToFridayClose: "20:00",
      mondayToFridayEnabled: true,
      saturdayOpen: "09:00",
      saturdayClose: "18:00",
      saturdayEnabled: true,
      sundayOpen: "10:00",
      sundayClose: "17:00",
      sundayEnabled: true,
    },
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const response = await apiRequest("PATCH", "/api/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      // Convert nullable fields to their non-null equivalents
      const formData = {
        businessName: settings.businessName,
        contactEmail: settings.contactEmail,
        phone: settings.phone,
        address: settings.address,
        description: settings.description || "",
        mondayToFridayOpen: settings.mondayToFridayOpen || "09:00",
        mondayToFridayClose: settings.mondayToFridayClose || "20:00",
        mondayToFridayEnabled: settings.mondayToFridayEnabled === null ? true : settings.mondayToFridayEnabled,
        saturdayOpen: settings.saturdayOpen || "09:00",
        saturdayClose: settings.saturdayClose || "18:00",
        saturdayEnabled: settings.saturdayEnabled === null ? true : settings.saturdayEnabled,
        sundayOpen: settings.sundayOpen || "10:00",
        sundayClose: settings.sundayClose || "17:00",
        sundayEnabled: settings.sundayEnabled === null ? true : settings.sundayEnabled,
      };
      
      form.reset(formData);
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold text-primary mb-6">System Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormField
                    control={form.control}
                    name="mondayToFridayEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="font-medium text-base">Monday - Friday</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="mondayToFridayOpen"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Open</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("mondayToFridayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end pb-[2px]">-</div>
                  
                  <FormField
                    control={form.control}
                    name="mondayToFridayClose"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Close</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("mondayToFridayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormField
                    control={form.control}
                    name="saturdayEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="font-medium text-base">Saturday</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="saturdayOpen"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Open</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("saturdayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end pb-[2px]">-</div>
                  
                  <FormField
                    control={form.control}
                    name="saturdayClose"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Close</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("saturdayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormField
                    control={form.control}
                    name="sundayEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="font-medium text-base">Sunday</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="sundayOpen"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Open</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("sundayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end pb-[2px]">-</div>
                  
                  <FormField
                    control={form.control}
                    name="sundayClose"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Close</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!form.watch("sundayEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="accent"
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
