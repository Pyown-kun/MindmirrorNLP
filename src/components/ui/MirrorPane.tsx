import type { ReactNode } from 'react';

interface MirrorPaneProps {
  children: ReactNode;
  className?: string;
  sheen?: boolean;
}

/**
 * The MirrorPane is MindMirror's signature visual element: a rounded,
 * glass-like card with a soft reflective sweep on entry, echoing the
 * "mirror" metaphor. It wraps the content of every step in the flow.
 */
export const MirrorPane = ({ children, className = '', sheen = true }: MirrorPaneProps) => {
  return (
    <div
      className={`relative w-full rounded-[28px] border border-white/60 bg-surface/90 backdrop-blur-sm p-6 sm:p-10 shadow-[0_20px_60px_-25px_rgba(27,29,35,0.35)] ${
        sheen ? 'mirror-pane' : ''
      } ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
