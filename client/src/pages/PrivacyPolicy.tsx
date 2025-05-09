
import PolicyLayout from '@/components/PolicyLayout';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
      <p className="mb-4">We collect information that you provide directly to us, including:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Name and contact information</li>
        <li>Booking details and preferences</li>
        <li>Payment information</li>
        <li>Communication history</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Process your bookings</li>
        <li>Send appointment confirmations</li>
        <li>Improve our services</li>
        <li>Communicate with you about promotions</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
      <p className="mb-4">We do not sell or share your personal information with third parties except as necessary to provide our services.</p>
    </PolicyLayout>
  );
}
