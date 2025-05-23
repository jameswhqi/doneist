import prisma from '@/lib/prisma';

export default async function Home() {
  const projects = await prisma.project.findMany({ include: { tasks: true } });

  const today = new Date();

  function formatDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

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
                  <div className='w-10 text-right'>{t.date && formatDate(t.date)}</div>
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
