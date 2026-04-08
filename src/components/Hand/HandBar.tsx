import { AnimatePresence, motion } from 'framer-motion';
import type { DragonCard, ActionCard } from '../../engine/types';
import { DragonCard as DragonCardComp, ActionCard as ActionCardComp } from '../Card';

type Props = {
  hand: (DragonCard | ActionCard)[];
  selectedCardId: string | null;
  selectedRotation?: 0 | 180;
  onSelectCard: (id: string) => void;
  cardSize?: 'sm' | 'md';
};

export default function HandBar({ hand, selectedCardId, selectedRotation = 0, onSelectCard, cardSize = 'md' }: Props) {
  return (
    <div className="h-24 sm:h-36 bg-transparent border-t border-white/10 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 shrink-0 overflow-x-auto">
      {hand.length === 0 && (
        <span className="text-white/20 text-sm tracking-widest">No cards</span>
      )}
      <AnimatePresence initial={false}>
        {hand.map(card => {
          const selected = card.id === selectedCardId;
          return (
            <motion.div
              key={card.id}
              initial={{ y: 60, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              {card.type === 'dragon' ? (
                <DragonCardComp
                  card={card}
                  selected={selected}
                  rotation={selected ? selectedRotation : 0}
                  onClick={() => onSelectCard(card.id)}
                  size={cardSize}
                />
              ) : (
                <ActionCardComp
                  card={card}
                  selected={selected}
                  onClick={() => onSelectCard(card.id)}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
