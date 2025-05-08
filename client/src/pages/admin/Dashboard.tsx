import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });
  
  // Fetch recent bookings
  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings/recent"],
  });

  // Fetch popular services
  const { data: popularServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/admin/services/popular"],
  });

  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="admin-stat-card">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-primary text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalBookings}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="admin-stat-card">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Income</p>
              <p className="text-primary text-2xl font-bold">
                {statsLoading ? "..." : `₱${stats?.totalIncome}`}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="admin-stat-card">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Staff</p>
              <p className="text-primary text-2xl font-bold">
                {statsLoading ? "..." : stats?.activeStaff}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="admin-stat-card">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Client Satisfaction</p>
              <p className="text-primary text-2xl font-bold">
                {statsLoading ? "..." : `${stats?.clientSatisfaction}/5`}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-primary text-lg">Recent Bookings</h3>
              <Link href="/admin/bookings" className="text-accent hover:underline text-sm">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 text-sm">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center">Loading bookings...</td>
                    </tr>
                  ) : recentBookings?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center">No recent bookings found</td>
                    </tr>
                  ) : (
                    recentBookings?.map((booking: any) => (
                      <tr key={booking.id} className="border-t border-gray-100">
                        <td className="py-3">{booking.name}</td>
                        <td className="py-3">{booking.serviceName}</td>
                        <td className="py-3">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                        <td className="py-3">
                          {booking.time.split(":")[0] > "12" 
                            ? `${parseInt(booking.time.split(":")[0]) - 12}:${booking.time.split(":")[1]} PM` 
                            : `${booking.time} AM`}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === "confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-primary text-lg">Popular Services</h3>
              <Link href="/admin/service-stats" className="text-accent hover:underline text-sm">Details</Link>
            </div>
            
            <div className="space-y-4">
              {servicesLoading ? (
                <div className="py-4 text-center">Loading services...</div>
              ) : (
                popularServices?.map((service: any) => (
                  <div key={service.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{service.name}</span>
                      <span className="text-sm text-gray-600">{service.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full" 
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
