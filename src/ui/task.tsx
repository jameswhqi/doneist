'use client';

import { saveDate } from '@/lib/actions';
import { assertNotNull, formatDateISO, formatUTCDate, formatUTCDateISO } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Task as PTask } from '@/prisma/client';
import clsx from 'clsx';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

type Props = {
  task: PTask;
  today: Date;
};

export default function Task({ task, today }: Props) {
  const [date, setDate] = useState(task.date);
  const oldDate = useRef(date);
  const newDate = useRef(date);
  const dragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    newDate.current = date;
  }, [date]);

  function handleMouseDown(e: React.MouseEvent) {
    if (date) {
      dragging.current = true;
      startY.current = e.clientY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    const diff = startY.current - e.clientY;
    if (Math.abs(diff) >= 10) {
      setDate((prev) => {
        assertNotNull(prev, 'prev');
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + (diff > 0 ? 1 : -1));
        return newDate;
      });
      startY.current = e.clientY;
    }
  }

  async function handleMouseUp() {
    dragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    assertNotNull(oldDate.current, 'oldDate');
    assertNotNull(newDate.current, 'newDate');
    if (newDate.current.getTime() !== oldDate.current.getTime()) {
      oldDate.current = newDate.current;
      try {
        await saveDate(newDate.current, task.id);
      } catch (error) {
        console.error('Failed to save date:', error);
      }
    }
  }

  const todayString = formatDateISO(today);

  const taskColor = date && (
    todayString > formatUTCDateISO(date)
      ? 'text-red-700'
      : todayString === formatUTCDateISO(date) && 'text-green-700'
  );

  return (
    <li className='flex gap-2 items-center'>
      <div className='size-5'>
        {date &&
          <ChevronUpDownIcon
            onMouseDown={handleMouseDown}
            className='select-none cursor-ns-resize'
          />
        }
      </div>
      <div className={clsx('w-10 text-right', taskColor)}>
        {date && formatUTCDate(date)}
      </div>
      <div className={clsx(taskColor)}>{task.title}</div>
    </li>
  );
}
