'use server';

import prisma from '@/lib/prisma';
import { Task } from '@/prisma/client';

export async function saveDate(date: Date, taskId: Task['id']) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { date },
    });
  } catch (error) {
    console.error('Failed to save date:', error);
    throw new Error('Failed to save date');
  }
}