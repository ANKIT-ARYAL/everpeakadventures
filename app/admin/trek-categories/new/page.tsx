import CategoryForm from "../../components/CategoryForm";

export default function NewTrekCategoryPage() {
  return (
    <CategoryForm
      title="Add New Trekking Category"
      subtitle="Create a trekking category with a description and featured image."
      backHref="/admin/trek-categories"
      createUrl="/api/trek-categories"
      updateUrl=""
    />
  );
}