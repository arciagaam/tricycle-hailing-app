import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const handleFullName = (fullName: { firstName: string | undefined, middleName: string | undefined, lastName: string | undefined }) => {
  const { firstName, middleName, lastName } = fullName;

  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${lastName}`
}