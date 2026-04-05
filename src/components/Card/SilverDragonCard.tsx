import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { DragonColor } from '../../engine/types';
import { SILVER_COLOR_BG, DRAGON_LABEL } from './colors';

type Props = {
  silverColor: DragonColor | 'all';
  size?: 'sm' | 'md' | 'lg';
};

const SIZE = {
  sm: { card: 'w-10 h-14' },
  md: { card: 'w-20 h-28' },
  lg: { card: 'w-28 h-40' },
};

export default function SilverDragonCard({ silverColor, size = 'md' }: Props) {
  const colorBg = SILVER_COLOR_BG[silverColor];
  const controls = useAnimation();
  const prevColor = useRef(silverColor);

  useEffect(() => {
    if (prevColor.current !== silverColor) {
      prevColor.current = silverColor;
      controls.start({
        scale: [1, 1.12, 1],
        filter: ['brightness(1)', 'brightness(1.6)', 'brightness(1)'],
        transition: { duration: 0.4, ease: 'easeOut' },
      });
    }
  }, [silverColor, controls]);

  return (
    <motion.div
      animate={controls}
      className={[
        SIZE[size].card,
        'rounded-lg border-2 border-zinc-400 flex flex-col items-center justify-center gap-1 bg-zinc-700 relative overflow-hidden shrink-0',
      ].join(' ')}
      title={`Silver Dragon — current color: ${silverColor}`}
    >
      {/* Color indicator strip at top */}
      <motion.div
        key={silverColor}
        className={['absolute top-0 left-0 right-0 h-2', colorBg].join(' ')}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Dragon emblem */}
      <img src="/dragon-emblem.png" alt="" className="h-3/4 w-auto opacity-45 mix-blend-multiply" />

      {/* Color badge */}
      <motion.div
        key={`badge-${silverColor}`}
        className={['w-4 h-4 rounded-full border border-white/30', colorBg].join(' ')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      />

      {/* Color label */}
      <span className="text-zinc-400 text-[8px] leading-none">
        {silverColor === 'all' ? 'All' : DRAGON_LABEL[silverColor as DragonColor]}
      </span>
    </motion.div>
  );
}
