import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-base text-ink placeholder:text-muted/60 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${
      props.className ?? ''
    }`}
  />
);

export const TextAreaInput = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full resize-none rounded-2xl border border-ink/10 bg-white px-5 py-4 text-base text-ink placeholder:text-muted/60 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${
      props.className ?? ''
    }`}
  />
);
