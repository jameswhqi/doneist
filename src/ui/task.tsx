'use client';

import { saveDate } from '@/lib/actions';
import { assertNotNull, dateParser, formatDateISO, formatUTCDate, formatUTCDateISO, validateUTCDate } from '@/lib/utils';
import { useState, useRef, useEffect, RefObject } from 'react';
import { Task as PTask } from '@/prisma/client';
import clsx from 'clsx';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

type Props = {
  task: PTask;
  today: Date;
  dragging: RefObject<boolean>;
};

export default function Task({ task, today, dragging }: Props) {
  const [date, setDate] = useState(task.date);
  const [showHandle, setShowHandle] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(formatUTCDate(date));
  const [inputError, setInputError] = useState(false);

  const oldDate = useRef(date);
  const newDate = useRef(date);
  const startY = useRef(0);

  const containerRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newDate.current = date;
  }, [date]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

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

  async function handleMouseUp(e: MouseEvent) {
    dragging.current = false;

    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (!containerRef.current?.contains(elementUnderCursor)) {
      setShowHandle(false);
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    assertNotNull(oldDate.current, 'oldDate');
    assertNotNull(newDate.current, 'newDate');
    if (newDate.current.getTime() !== oldDate.current.getTime()) {
      oldDate.current = newDate.current;
      try {
        setInputValue(formatUTCDate(newDate.current));
        await saveDate(newDate.current, task.id);
      } catch (error) {
        console.error('Failed to save date:', error);
      }
    }
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      try {
        const result = dateParser.fork(
          inputValue,
          (error, _) => { throw new Error(error); },
          (result, _) => result
        );

        const year = result.month - today.getUTCMonth() > 6
          ? today.getFullYear() + 1
          : today.getFullYear();
        const newDate = validateUTCDate(year, result.month, result.day);

        setDate(newDate);
        setInputValue(formatUTCDate(newDate));
        setEditing(false);
        await saveDate(newDate, task.id);
      } catch (error) {
        setInputError(true);
        console.log(error);
      }
    } else if (e.key === "Escape") {
      setInputValue(formatUTCDate(date));
      setEditing(false);
    }
  }

  function handleBlur() {
    setInputValue(formatUTCDate(date));
    setEditing(false);
  }

  const todayString = formatDateISO(today);

  const taskColor = date && (
    todayString > formatUTCDateISO(date)
      ? 'text-red-700'
      : todayString === formatUTCDateISO(date) && 'text-green-700'
  );

  return (
    <li
      ref={containerRef}
      className='flex gap-2 items-center'
      onMouseEnter={() => !dragging.current && setShowHandle(true)}
      onMouseLeave={() => !dragging.current && setShowHandle(false)}
    >
      <div className='size-5'>
        {date &&
          <ChevronUpDownIcon
            onMouseDown={handleMouseDown}
            className={clsx('select-none cursor-ns-resize', !showHandle && 'invisible')}
          />
        }
      </div>
      <div className='w-12 text-right'>
        {editing ? (
          <input
            className={clsx('w-12 px-1 text-right', inputError && 'outline-red-700')}
            ref={inputRef}
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setInputError(false);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        ) : (
          <div
            className={clsx('px-1', taskColor)}
            onClick={() => setEditing(true)}
          >{formatUTCDate(date)}</div>
        )}
      </div>
      <div className={clsx(taskColor)}>{task.title}</div>
    </li>
  );
}
