export type Entry = {
  name: string;
  dirname: string;
  fullPath: string;
  isDirectory: boolean;
  children?: readonly Entry[];
};

export type Cancelled = { isCancelled: true };

export type DialogResponse<T> = { value: T; isCancelled: false } | Cancelled;

export const cancelled: DialogResponse<never> = { isCancelled: true };

export const success = <T>(value: T): DialogResponse<T> => ({
  value,
  isCancelled: false,
});
