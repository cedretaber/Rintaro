type Ok<T> = { value: T; isOk: true; isNg: false };
type Ng<E> = { error: E; isOk: false; isNg: true };

type Result<T, E> = Ok<T> | Ng<E>;

export const ok = <T>(value: T): Result<T, never> => ({
  value,
  isOk: true,
  isNg: false,
});
export const ng = <E>(error: E): Result<never, E> => ({
  error,
  isOk: false,
  isNg: true,
});

export const sequence = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const arr: T[] = [];
  for (const result of results) {
    if (result.isNg) {
      return result;
    } else {
      arr.push(result.value);
    }
  }
  return ok(arr);
};

export const map = <T, U, E>(
  f: (value: T) => U,
  m: Result<T, E>
): Result<U, E> => (m.isOk ? ok(f(m.value)) : m);

export const flatMap = <T, U, E>(
  f: (value: T) => Result<U, E>,
  m: Result<T, E>
): Result<U, E> => (m.isOk ? f(m.value) : m);

export default Result;
