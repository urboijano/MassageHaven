
import PolicyLayout from '@/components/PolicyLayout';

export default function TermsOfService() {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing and using our services, you agree to be bound by these Terms of Service.</p>

      <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
      <p className="mb-4">We provide massage and wellness services through our booking platform.</p>

      <h2 className="text-2xl font-bold mb-4">3. Booking and Cancellation</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>24-hour cancellation notice required</li>
        <li>Late arrivals may result in shortened service time</li>
        <li>No-shows will be charged full service fee</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
      <p className="mb-4">Payment is required at the time of service. We accept major credit cards and cash.</p>
    </PolicyLayout>
  );
}
