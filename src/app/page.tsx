import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Task from '@/ui/task';

export default async function Home() {
  const projects = await prisma.project.findMany({ include: { tasks: true } });

  const today = new Date();

  return (
    <main>
      <div>Today: {formatDate(today)}</div>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <div>{p.title}</div>
            <ul>
              {p.tasks.map(t => <Task key={t.id} task={t} today={today} />)}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
