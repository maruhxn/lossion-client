import Link from "next/link";

export default function CategorySection() {
  return (
    <div className="bg-gray-50/90">
      <div className="py-6">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-6 lg:gap-8 xl:px-6">
          <nav className="flex items-center justify-center space-x-4 text-sm md:space-x-6">
            <Link
              className="font-medium tracking-wide transition-colors hover:text-gray-900 dark:hover:text-gray-50"
              href="#"
            >
              Love Stories
            </Link>
            <Link
              className="font-medium tracking-wide transition-colors hover:text-gray-900 dark:hover:text-gray-50"
              href="#"
            >
              Relationship Advice
            </Link>
            <Link
              className="font-medium tracking-wide transition-colors hover:text-gray-900 dark:hover:text-gray-50"
              href="#"
            >
              Dating Tips
            </Link>
            <Link
              className="font-medium tracking-wide transition-colors hover:text-gray-900 dark:hover:text-gray-50"
              href="#"
            >
              Q&A
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
