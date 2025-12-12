/**
 * Runs an async function and returns its result.
 * If the function throws, logs the error and returns undefined.
 *
 * @param fn - A zero-arg async function that returns T
 * @returns The resolved value of fn() or undefined on error
 */
const asyncWrapper = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default asyncWrapper;
