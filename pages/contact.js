import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-tertiary-bg py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-accent to-secondary-accent shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-card-bg shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Contact Us</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-text-secondary sm:text-lg sm:leading-7">
                <p>If you have any questions or need further information, please feel free to reach out to us.</p>
                <p>Email: <a href="mailto:info@duotrak.com" className="text-primary-accent hover:text-secondary-accent">support@duotrak.com</a></p>
                <p>We will get back to you as soon as possible.</p>
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