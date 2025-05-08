import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch bookings
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["/api/admin/bookings", currentPage, statusFilter],
  });

  const bookings = bookingsData?.bookings || [];
  const totalPages = bookingsData?.totalPages || 1;

  // Handle booking deletion
  const deleteBooking = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bookings/${id}`);
    },
    onSuccess: () => {
      // Invalidate all relevant queries to update data across the app
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services/popular"] });
      
      toast({ 
        title: "Booking deleted",
        description: "The booking has been successfully deleted"
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle booking status update
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      // Invalidate all relevant queries to update data across the app
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services/popular"] });
      
      toast({ 
        title: "Status updated",
        description: "The booking status has been updated"
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter bookings by search term
  const filteredBookings = searchTerm
    ? bookings.filter((booking: any) => 
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bookings;

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Confirm delete dialog
  const openDeleteDialog = (booking: any) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateBookingStatus.mutate({ id, status });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-primary">Booking Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">Loading bookings...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">No bookings found</td>
                </tr>
              ) : (
                filteredBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{booking.id}</td>
                    <td className="px-6 py-4">{booking.name}</td>
                    <td className="px-6 py-4 text-sm">{booking.email}</td>
                    <td className="px-6 py-4">{booking.serviceName}</td>
                    <td className="px-6 py-4 text-sm">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                    <td className="px-6 py-4 text-sm">
                      {booking.time.split(":")[0] > "12" 
                        ? `${parseInt(booking.time.split(":")[0]) - 12}:${booking.time.split(":")[1]} PM` 
                        : `${booking.time} AM`}
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                        disabled={updateBookingStatus.isPending}
                      >
                        <SelectTrigger className="h-7 px-2 py-0 text-xs">
                          <span className={`
                            px-2 py-1 rounded-full 
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                            ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                            ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                          `}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 h-8 w-8 p-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                          onClick={() => openDeleteDialog(booking)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {bookings.length > 0 
              ? `Showing ${(currentPage - 1) * 10 + 1} to ${Math.min(currentPage * 10, bookings.length)} of ${bookings.length} entries`
              : 'No entries found'
            }
          </span>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "accent" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Client:</div>
                <div>{selectedBooking.name}</div>
                <div className="font-medium">Service:</div>
                <div>{selectedBooking.serviceName}</div>
                <div className="font-medium">Date:</div>
                <div>{format(new Date(selectedBooking.date), "MMMM d, yyyy")}</div>
                <div className="font-medium">Time:</div>
                <div>
                  {selectedBooking.time.split(":")[0] > "12" 
                    ? `${parseInt(selectedBooking.time.split(":")[0]) - 12}:${selectedBooking.time.split(":")[1]} PM` 
                    : `${selectedBooking.time} AM`}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteBooking.mutate(selectedBooking.id)}
              disabled={deleteBooking.isPending}
            >
              {deleteBooking.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
