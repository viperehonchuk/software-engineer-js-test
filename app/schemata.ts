import * as v from "valibot";

export const configSchema = v.object({
  canvas: v.object({
    photo: v.object({
      src: v.string(),
      x: v.number(),
      y: v.number(),
    }),
  }),
});

export type PhotoEditorConfig = v.InferInput<typeof configSchema>;
