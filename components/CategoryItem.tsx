// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} prefetch className="group">
      <div className="relative overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm p-6 text-black ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover-wave">
        {children}

        <h3 className="font-semibold text-xl mt-2">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
