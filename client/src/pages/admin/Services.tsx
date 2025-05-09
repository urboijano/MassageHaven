import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Service } from "@shared/schema";
import { ImageResizer } from "@/components/ui/image-resizer";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Form schema for service creation and editing
const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  duration: z.coerce.number().int().positive({ message: "Duration must be a positive integer" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  featured: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export default function Services() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState(''); 
  const [isCropperOpen, setIsCropperOpen] = useState(false); 

  const { toast } = useToast();

  // Fetch services
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Create service mutation
  const createService = useMutation({
    mutationFn: async (data: ServiceFormValues) => {
      const response = await apiRequest("POST", "/api/services", data);
      return response.json();
    },
    onSuccess: (newService) => {
      queryClient.setQueryData<Service[]>(["/api/services"], (oldData) => {
        if (!oldData) return [newService];
        return [...oldData, newService];
      });

      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services/featured"] });

      setIsCreateDialogOpen(false);
      toast({
        title: "Service created",
        description: "The service has been successfully created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update service mutation
  const updateService = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ServiceFormValues }) => {
      const response = await apiRequest("PATCH", `/api/services/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedService) => {
      queryClient.setQueryData<Service[]>(["/api/services"], (oldData) => {
        if (!oldData) return [updatedService];

        return oldData.map(service => 
          service.id === updatedService.id ? updatedService : service
        );
      });

      queryClient.invalidateQueries({ queryKey: ["/api/services/featured"] });

      queryClient.invalidateQueries({ queryKey: ["/api/services"] });

      setIsEditDialogOpen(false);
      toast({
        title: "Service updated",
        description: "The service has been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete service mutation
  const deleteService = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
      return id; 
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Service[]>(["/api/services"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(service => service.id !== deletedId);
      });

      queryClient.invalidateQueries({ queryKey: ["/api/services/featured"] });

      queryClient.invalidateQueries({ queryKey: ["/api/services"] });

      setIsDeleteDialogOpen(false);
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create form
  const createForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      imageUrl: "",
      featured: false,
    },
  });

  // Edit form
  const editForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      imageUrl: "",
      featured: false,
    },
  });

  // Open create dialog
  const handleOpenCreateDialog = () => {
    createForm.reset({
      name: "",
      description: "",
      price: 0,
      duration: 60,
      imageUrl: "",
      featured: false,
    });
    setIsCreateDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (service: Service) => {
    setSelectedService(service);
    editForm.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      imageUrl: service.imageUrl,
      featured: service.featured,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  // Handle create submit
  const onCreateSubmit = (data: ServiceFormValues) => {
    createService.mutate(data);
  };

  // Handle edit submit
  const onEditSubmit = (data: ServiceFormValues) => {
    if (selectedService) {
      updateService.mutate({ id: selectedService.id, data });
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (selectedService) {
      deleteService.mutate(selectedService.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-primary">Service Management</h2>
        <Button 
          variant="accent" 
          onClick={handleOpenCreateDialog}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <LoadingSpinner />
          </div>
        ) : services?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No services found. Create your first service!</p>
          </div>
        ) : (
          services?.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-secondary bg-opacity-5 p-6 relative">
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8 rounded-full bg-white shadow-md text-blue-600 hover:text-blue-800"
                    onClick={() => handleOpenEditDialog(service)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8 rounded-full bg-white shadow-md text-red-600 hover:text-red-800"
                    onClick={() => handleOpenDeleteDialog(service)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-primary text-lg">{service.name}</h3>
                  <span className="font-bold text-accent">₱{service.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{service.duration} minutes</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  {service.featured && (
                    <span className="bg-accent bg-opacity-10 text-accent text-xs px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Service Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Service</DialogTitle>
            <DialogDescription>
              Add a new service to your spa's offerings.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Deep Tissue Massage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₱)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="15" step="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the service..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Service</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this service prominently on the home page
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent" disabled={createService.isPending}>
                  {createService.isPending ? "Creating..." : "Create Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details of this service.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Deep Tissue Massage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₱)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="15" step="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the service..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Service</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this service prominently on the home page
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent" disabled={updateService.isPending}>
                  {updateService.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <div className="font-medium text-red-800 mb-1">You are about to delete:</div>
              <div className="text-red-700">{selectedService.name}</div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteService.isPending}
            >
              {deleteService.isPending ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}