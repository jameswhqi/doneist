import prisma from '@/lib/prisma';
import Projects from '@/ui/projects';

export default async function Home() {
  const projects = await prisma.project.findMany({ include: { tasks: true } });

  return <Projects projects={projects} />;
}
