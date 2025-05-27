import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import DraggableDate from '@/ui/draggable-date';

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
              {p.tasks.map(t => (
                <li key={t.id} className='flex gap-2'>
                  <div className='w-10 text-right'>
                    {t.date && <DraggableDate initDate={t.date} taskId={t.id} />}
                  </div>
                  <div>{t.title}</div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
