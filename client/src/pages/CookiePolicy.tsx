
import PolicyLayout from '@/components/PolicyLayout';

export default function CookiePolicy() {
  return (
    <PolicyLayout title="Cookie Policy">
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
      <p className="mb-4">Cookies are small text files stored on your device when you visit our website.</p>

      <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Essential cookies for website functionality</li>
        <li>Analytics cookies to improve our service</li>
        <li>Preference cookies to remember your settings</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
      <p className="mb-4">You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
    </PolicyLayout>
  );
}
