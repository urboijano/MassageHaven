import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ServiceStats() {
  // Fetch popular services
  const { data: popularServices, isLoading } = useQuery({
    queryKey: ["/api/admin/services/popular"],
  });

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const service = payload[0].payload;
      return (
        <div className="bg-white p-3 border shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-accent">
            {`Popularity: ${payload[0].value}%`}
          </p>
          <p className="text-gray-600 text-sm">
            {`Price: ₱${service.price}`}
          </p>
          <p className="text-gray-600 text-sm">
            {`Duration: ${service.duration} minutes`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Service Popularity Statistics</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Service Popularity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularServices}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} label={{ value: 'Popularity %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="percentage" name="Popularity" fill="#8A9B6E" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Service Popularity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                  <th className="px-6 py-3 font-medium">Rank</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Popularity</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">Loading service statistics...</td>
                  </tr>
                ) : popularServices?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No service data available</td>
                  </tr>
                ) : (
                  popularServices?.map((service: any, index: number) => (
                    <tr key={service.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{service.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[150px] mr-2">
                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${service.percentage}%` }}></div>
                          </div>
                          <span className="text-sm">{service.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">₱{service.price}</td>
                      <td className="px-6 py-4 text-sm">{service.duration} minutes</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}