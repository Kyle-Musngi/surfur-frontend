import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="flex justify-center mb-2">
        <img
          src="/images/sulfor-logo.jpeg"
          alt="SurFur"
          className="h-16 w-auto object-contain rounded-xl shadow-xs"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
          }}
        />
      </div>
      <span className="text-6xl font-black text-[#F4435A] dark:text-[#F48FB1]">404</span>
      <h1 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">Page Not Found</h1>
      <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
        The pet, shelter, or page you were looking for doesn't exist or has moved.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button size="sm">Return to SurFur Home</Button>
        </Link>
      </div>
    </div>
  );
}
