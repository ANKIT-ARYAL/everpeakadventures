import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TeamForm from "../../TeamForm";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();
  return <TeamForm initialData={member} isEditing={true} />;
}
