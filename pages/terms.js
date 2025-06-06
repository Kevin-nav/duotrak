import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-tertiary-bg py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-accent to-secondary-accent shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-card-bg shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Terms and Conditions</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-text-secondary sm:text-lg sm:leading-7">
                <p>Welcome to DuoTrak. These terms and conditions outline the rules and regulations for the use of DuoTrak's Website, located at duotrak.com.</p>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use DuoTrak if you do not agree to take all of the terms and conditions stated on this page.</p>
                <p><strong>Placeholder:</strong> More detailed terms and conditions will be added here.</p>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>
                  <Link href="/" className="text-primary-accent hover:text-secondary-accent">
                    &larr; Back to Home
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 