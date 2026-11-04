import { Link } from "react-router-dom";
import SectionHeader from "../common/SectionHeader";

const CategoryGrid = () => {
  return (
    <section>
      <SectionHeader
        eyebrow="Explore departments"
        title="Shop by Category"
        titleId="category-title"
      >
        <p className="text-[13px] leading-4 font-semibold text-subtle">
          curated departments
        </p>
      </SectionHeader>

      <ul className="grid grid-cols gap-4 sm:grid-cols-4 lg:grid-cols-8">
        <li>
          <Link
            to="/shop"
            className="flex flex-col items-center rounded-2xl bg-surface pt-4 pb-4 shadow-card transition-shadow hover:shadow-md"
          >
            <span></span>
            <span className="text-[13px] leading-4 font-medium text-ink">
              Electronics
            </span>
            <span className="mt-0.05 text-[11px] leading-4.25 font-medium text-subtle">
              340+ items
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default CategoryGrid;
