import { CATEGORY_BASE_URL } from "@/apis/category-api";
import { Category } from "@/types/category";

export default async function CategorySection() {
  const data = await (await fetch(CATEGORY_BASE_URL())).json();
  const categories = data.data as Category[];

  return (
    <div className="bg-gray-50/90">
      <div className="py-6">
        <div className="container grid items-center gap-4 px-4 text-center md:gap-6 lg:gap-8 xl:px-6">
          <nav className="flex items-center justify-center space-x-4 text-sm md:space-x-6">
            {categories.map((category) => (
              <span
                key={category.id}
                className="font-medium tracking-wide transition-colors text-gray-500 hover:text-gray-900 hover:font-medium dark:hover:text-gray-50 cursor-pointer"
              >
                {category.name}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
