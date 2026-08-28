import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogForm from "../../BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return <BlogForm initialData={post} isEditing={true} />;
}