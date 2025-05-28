'use client';

import { formatDate, ProjectWithPosts } from '@/lib/utils';
import Task from '@/ui/task';
import { useRef } from 'react';

type Props = {
  projects: ProjectWithPosts[];
};

export default function Projects({ projects }: Props) {
  const today = new Date();

  const dragging = useRef(false);

  return (
    <main>
      <div>Today: {formatDate(today)}</div>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <div>{p.title}</div>
            <ul>
              {p.tasks.map(t => <Task key={t.id} task={t} today={today} dragging={dragging} />)}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}