import type { CollectorResult } from '@device-analyzer/shared';

export interface Collector<T = unknown> {
  name: string;
  category: string;
  requiresAdmin: boolean;
  collect(): Promise<CollectorResult<T>>;
}

/**
 * Wraps any collection task in standardized timing, error handling, and availability metadata.
 */
export async function executeCollector<T>(
  name: string,
  requiresAdmin: boolean,
  task: () => Promise<T>
): Promise<CollectorResult<T>> {
  const startTime = Date.now();
  try {
    const data = await task();
    return {
      data,
      available: data !== null && data !== undefined,
      requiresAdmin,
      timestamp: startTime,
      durationMs: Date.now() - startTime
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      data: null,
      available: false,
      error: errorMessage,
      requiresAdmin,
      timestamp: startTime,
      durationMs: Date.now() - startTime
    };
  }
}

