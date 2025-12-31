type TryCatchType<T, E> =
  | { result: T; error: null }
  | { result: null; error: E };

// Overloads for type safety
function tryCatch<T, E = Error>(fn: () => T): TryCatchType<T, E>;
function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<TryCatchType<T, E>>;
function tryCatch<T, E = Error>(
  fn: () => Promise<T>
): Promise<TryCatchType<T, E>>;

// Implementation
function tryCatch<T, E = Error>(
  fnOrPromise: (() => T) | (() => Promise<T>) | Promise<T>
): TryCatchType<T, E> | Promise<TryCatchType<T, E>> {
  if (typeof fnOrPromise === "function") {
    try {
      const result = fnOrPromise();
      if (result instanceof Promise) {
        return result
          .then((r) => ({ result: r, error: null }))
          .catch((e) => ({ result: null, error: e as E }));
      } else {
        return { result, error: null };
      }
    } catch (err: unknown) {
      return { result: null, error: err as E };
    }
  } else {
    // It's a promise
    return fnOrPromise
      .then((r) => ({ result: r, error: null }))
      .catch((e) => ({ result: null, error: e as E }));
  }
}

export { tryCatch, type TryCatchType };
