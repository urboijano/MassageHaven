import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
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
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Staff as StaffType } from "@shared/schema";

// Form schema for staff creation and editing
const staffFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  imageUrl: z.string().optional(),
  initials: z.string().min(1, { message: "Initials are required" }).max(2, { message: "Maximum 2 characters allowed" }),
  active: z.boolean().default(false),
  sessions: z.coerce.number().int().nonnegative().default(0),
  rating: z.coerce.number().min(0, { message: "Rating must be at least 0" }).max(5, { message: "Rating must be at most 5" }).default(5),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

export default function StaffPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);
  
  const { toast } = useToast();

  // Fetch staff
  const { data: staffMembers, isLoading } = useQuery<StaffType[]>({
    queryKey: ["/api/staff"],
  });

  // Create staff mutation
  const createStaff = useMutation({
    mutationFn: async (data: StaffFormValues) => {
      const response = await apiRequest("POST", "/api/staff", data);
      return response.json();
    },
    onSuccess: (newStaff) => {
      // Immediately update the cache with the new staff
      queryClient.setQueryData<StaffType[]>(["/api/staff"], (oldData) => {
        if (!oldData) return [newStaff];
        return [...oldData, newStaff];
      });
      
      // Still invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      
      setIsCreateDialogOpen(false);
      toast({
        title: "Staff created",
        description: "The staff member has been successfully added",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating staff",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update staff mutation
  const updateStaff = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: StaffFormValues }) => {
      const response = await apiRequest("PATCH", `/api/staff/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedStaff) => {
      // Immediately update the cache with the new data
      queryClient.setQueryData<StaffType[]>(["/api/staff"], (oldData) => {
        if (!oldData) return [updatedStaff];
        
        return oldData.map(staff => 
          staff.id === updatedStaff.id ? updatedStaff : staff
        );
      });
      
      // Still invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      
      setIsEditDialogOpen(false);
      toast({
        title: "Staff updated",
        description: "The staff member has been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating staff",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete staff mutation
  const deleteStaff = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/staff/${id}`);
      return id; // Return the ID for use in onSuccess
    },
    onSuccess: (deletedId) => {
      // Immediately update the cache by removing the deleted staff
      queryClient.setQueryData<StaffType[]>(["/api/staff"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(staff => staff.id !== deletedId);
      });
      
      // Still invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      
      setIsDeleteDialogOpen(false);
      toast({
        title: "Staff deleted",
        description: "The staff member has been successfully deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting staff",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create form
  const createForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      initials: "",
      active: false, // Make inactive by default
      sessions: 0,
      rating: 5,
    },
  });

  // Edit form
  const editForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      initials: "",
      active: false, // Set to inactive by default for consistency
      sessions: 0,
      rating: 5,
    },
  });

  // Handle full name to initials conversion
  const generateInitials = (name: string) => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '';
  };

  // Open create dialog
  const handleOpenCreateDialog = () => {
    createForm.reset({
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      initials: "",
      active: false, // Set to inactive by default
      sessions: 0,
      rating: 5,
    });
    setIsCreateDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (staff: StaffType) => {
    setSelectedStaff(staff);
    editForm.reset({
      name: staff.name,
      role: staff.role,
      bio: staff.bio,
      imageUrl: staff.imageUrl || "",
      initials: staff.initials,
      active: staff.active === null ? false : Boolean(staff.active),
      sessions: staff.sessions || 0,
      rating: staff.rating || 5,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (staff: StaffType) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  // Handle create submit
  const onCreateSubmit = (data: StaffFormValues) => {
    createStaff.mutate(data);
  };

  // Handle edit submit
  const onEditSubmit = (data: StaffFormValues) => {
    if (selectedStaff) {
      updateStaff.mutate({ id: selectedStaff.id, data });
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (selectedStaff) {
      deleteStaff.mutate(selectedStaff.id);
    }
  };

  // Handle name change to auto-generate initials
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'create' | 'edit') => {
    const name = e.target.value;
    const initials = generateInitials(name);
    
    if (formType === 'create') {
      createForm.setValue('name', name);
      createForm.setValue('initials', initials);
    } else {
      editForm.setValue('name', name);
      editForm.setValue('initials', initials);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-primary">Staff Management</h2>
        <Button 
          variant="accent" 
          onClick={handleOpenCreateDialog}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Staff
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-pulse">Loading staff...</div>
          </div>
        ) : staffMembers?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No staff members found. Add your first staff member!</p>
          </div>
        ) : (
          staffMembers?.map((staffMember) => (
            <Card key={staffMember.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden">
                  {staffMember.imageUrl ? (
                    <img 
                      src={staffMember.imageUrl} 
                      alt={staffMember.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-primary font-bold bg-secondary">
                      {staffMember.initials}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-primary text-lg mb-1">{staffMember.name}</h3>
                <p className="text-accent mb-3">{staffMember.role}</p>
                <p className="text-gray-600 text-center mb-4 line-clamp-3">{staffMember.bio}</p>
                <div className="flex space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{staffMember.sessions || 0} sessions</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{(staffMember.rating || 5).toFixed(1)}/5</span>
                  </div>
                </div>
                {!staffMember.active && (
                  <div className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full mb-4">
                    Inactive
                  </div>
                )}
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleOpenEditDialog(staffMember)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleOpenDeleteDialog(staffMember)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Staff Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Add details for the new staff member.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Jane Smith" 
                        {...field} 
                        onChange={(e) => handleNameChange(e, 'create')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Massage Therapist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="initials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initials</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JS"
                          maxLength={2}
                          {...field}
                          value={field.value?.toUpperCase()}
                        />
                      </FormControl>
                      <FormDescription>Auto-generated from name (can be edited)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={createForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of experience and specialties..." 
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank to use initials instead</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="sessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Sessions</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={createForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive staff members won't be shown to clients
                      </FormDescription>
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
                <Button type="submit" variant="accent" disabled={createStaff.isPending}>
                  {createStaff.isPending ? "Adding..." : "Add Staff Member"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the details of this staff member.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Jane Smith" 
                        {...field} 
                        onChange={(e) => handleNameChange(e, 'edit')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Massage Therapist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="initials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initials</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JS"
                          maxLength={2}
                          {...field}
                          value={field.value?.toUpperCase()}
                        />
                      </FormControl>
                      <FormDescription>Auto-generated from name (can be edited)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of experience and specialties..." 
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank to use initials instead</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="sessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Sessions</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive staff members won't be shown to clients
                      </FormDescription>
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
                <Button type="submit" variant="accent" disabled={updateStaff.isPending}>
                  {updateStaff.isPending ? "Saving..." : "Save Changes"}
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
              Are you sure you want to delete this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <div className="font-medium text-red-800 mb-1">You are about to delete:</div>
              <div className="text-red-700">{selectedStaff.name} - {selectedStaff.role}</div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteStaff.isPending}
            >
              {deleteStaff.isPending ? "Deleting..." : "Delete Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
