export type ApiResponse =
  | { status: number; ok: true; json: unknown }
  | { status: number; ok: false; json: { error: string } };
