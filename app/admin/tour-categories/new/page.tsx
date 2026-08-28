import CategoryForm from "../../components/CategoryForm";

export default function NewTourCategoryPage() {
  return (
    <CategoryForm
      title="Add New Tour Category"
      subtitle="Create a tour category with a description and featured image."
      backHref="/admin/tour-categories"
      createUrl="/api/tour-categories"
      updateUrl=""
    />
  );
}