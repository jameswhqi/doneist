'use client';

import { saveDate } from '@/lib/actions';
import { formatDateISO, formatUTCDate, formatUTCDateISO } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Task } from '@/prisma/client';
import clsx from 'clsx';

type Props = {
  initDate: Date;
  taskId: Task['id'];
};

export default function DraggableDate({ initDate, taskId }: Props) {
  const [date, setDate] = useState(initDate);
  const oldDate = useRef(date);
  const newDate = useRef(date);
  const dragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    newDate.current = date;
  }, [date]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    const diff = startY.current - e.clientY;
    if (Math.abs(diff) >= 10) {
      setDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + (diff > 0 ? 1 : -1));
        return newDate;
      });
      startY.current = e.clientY;
    }
  };

  const handleMouseUp = async () => {
    dragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (newDate.current.getTime() !== oldDate.current.getTime()) {
      oldDate.current = newDate.current;
      try {
        console.log('saving');
        await saveDate(newDate.current, taskId);
      } catch (error) {
        console.error('Failed to save date:', error);
      }
    }
  };

  const today = new Date(); // TODO: sync with parent
  const todayString = formatDateISO(today);
  const dateString = formatUTCDateISO(date);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={clsx('select-none cursor-ns-resize', todayString > dateString ? 'text-red-700' : todayString === dateString && 'text-green-700')}
    >
      {formatUTCDate(date)}
    </div>
  );
}
