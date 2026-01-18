import { number, object, string } from 'valibot';

export const configSchema = object({
  canvas: object({
    photo: object({
      src: string(),
      x: number(),
      y: number(),
    }),
  }),
});
