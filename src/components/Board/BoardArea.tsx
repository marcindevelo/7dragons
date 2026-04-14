import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PlacedCard, BoardPosition, DragonColor } from '../../engine/types';
import { DragonCard, SilverDragonCard } from '../Card';
import { posKey, adjacentEmptyPositions } from '../../engine/board';
import { useTranslation } from '../../i18n/LanguageContext';

const CARD_W  = 80;
const CARD_H  = 112;
const GAP_PX  = 4;
const STEP_X  = CARD_W + GAP_PX;
const STEP_Y  = CARD_H + GAP_PX;
const FIT_PAD = 5; // screen-space padding around content

type Props = {
  board: Map<string, PlacedCard>;
  silverColor: DragonColor | 'all';
  validPlacements?: BoardPosition[];
  targetablePosKeys?: Set<string>;
  selectedPosKey?: string | null;
  selectedRotation?: 0 | 180;
  lastPlacedPosKey?: string | null;
  lastZappedPosKey?: string | null;
  lastMovedFromPosKey?: string | null;
  zapTargeting?: boolean;
  onDropZoneClick?: (pos: BoardPosition) => void;
  onBoardCardClick?: (posKey: string) => void;
};

export default function BoardArea({
  board,
  silverColor,
  validPlacements = [],
  targetablePosKeys,
  selectedPosKey,
  selectedRotation,
  lastPlacedPosKey,
  lastZappedPosKey,
  lastMovedFromPosKey,
  zapTargeting,
  onDropZoneClick,
  onBoardCardClick,
}: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [silverBlocked, setSilverBlocked] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Auto-fit whenever the board changes — show all cards + potential next-move positions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Collect all grid positions that need to be visible
    const positions: BoardPosition[] = [
      { x: 0, y: 0 }, // Silver Dragon
      ...Array.from(board.values()).map(p => p.pos),
      ...adjacentEmptyPositions(board),
    ];

    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Content size in pre-scale space
    const contentW = (maxX - minX) * STEP_X + CARD_W;
    const contentH = (maxY - minY) * STEP_Y + CARD_H;

    const cW = container.clientWidth;
    const cH = container.clientHeight;

    const newScale = Math.min(
      (cW - FIT_PAD * 2) / contentW,
      (cH - FIT_PAD * 2) / contentH,
      2.5 // allow zooming in at game start when board is nearly empty
    );

    // Center the bounding box
    const newPanX = -((minX + maxX) / 2) * STEP_X;
    const newPanY = -((minY + maxY) / 2) * STEP_Y;

    const clamped = Math.max(newScale, 0.1);
    scaleRef.current = clamped;
    setScale(clamped);
    setPan({ x: newPanX, y: newPanY });
  }, [board]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.target as HTMLElement).dataset.pannable)) {
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const s = scaleRef.current;
    setPan(p => ({ x: p.x + dx / s, y: p.y + dy / s }));
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const s = scaleRef.current;
    setPan(p => ({ x: p.x - e.deltaX / s, y: p.y - e.deltaY / s }));
  }, []);

  function gridToPx(gx: number, gy: number) {
    return { left: gx * STEP_X + pan.x, top: gy * STEP_Y + pan.y };
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative bg-transparent cursor-grab active:cursor-grabbing"
      data-pannable="true"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* Dot-grid background (unscaled, tracks pan only) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff0a 1px, transparent 1px)',
          backgroundSize: `${STEP_X * scale}px ${STEP_Y * scale}px`,
          backgroundPosition: `${(pan.x * scale) % (STEP_X * scale) + 50}% ${(pan.y * scale) % (STEP_Y * scale) + 50}%`,
        }}
      />

      {/* Scaled content wrapper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* Silver Dragon — always at (0,0) */}
        {(() => {
          const { left, top } = gridToPx(0, 0);
          return (
            <div
              className="absolute pointer-events-auto relative"
              style={{ left: `calc(50% + ${left}px - ${CARD_W / 2}px)`, top: `calc(50% + ${top}px - ${CARD_H / 2}px)` }}
              onClick={zapTargeting ? () => {
                setSilverBlocked(true);
                setTimeout(() => setSilverBlocked(false), 1500);
              } : undefined}
            >
              <SilverDragonCard silverColor={silverColor} size="md" />
              {silverBlocked && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-red-400 text-xs font-semibold px-2 py-1 rounded-lg pointer-events-none z-50">
                  {t('board.cantZapSilver')}
                </div>
              )}
            </div>
          );
        })()}

        {/* Placed dragon cards */}
        <AnimatePresence>
          {Array.from(board.entries()).map(([key, placed]) => {
            const { left, top } = gridToPx(placed.pos.x, placed.pos.y);
            const isTargetable = targetablePosKeys?.has(key);
            const isSelected = key === selectedPosKey;
            const isLastPlaced = key === lastPlacedPosKey;
            const isClickable = isTargetable || isSelected;
            return (
              <motion.div
                key={key}
                className={['absolute pointer-events-auto', isClickable ? 'cursor-pointer' : ''].join(' ')}
                style={{
                  left: `calc(50% + ${left}px - ${CARD_W / 2}px)`,
                  top:  `calc(50% + ${top}px - ${CARD_H / 2}px)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.2 }}
                onClick={isClickable ? () => onBoardCardClick?.(key) : undefined}
              >
                <DragonCard
                  card={placed.card}
                  size="md"
                  rotation={isSelected && selectedRotation !== undefined ? selectedRotation : placed.rotation as 0 | 180}
                />
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg border-2 border-cyan-400 bg-cyan-400/15 pointer-events-none shadow-[0_0_12px_2px_rgba(34,211,238,0.35)]" />
                )}
                {isTargetable && !isSelected && (
                  <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors pointer-events-none" />
                )}
                {isLastPlaced && !isSelected && !isTargetable && (
                  <div className="absolute inset-0 rounded-lg border-2 border-green-400/70 shadow-[0_0_14px_3px_rgba(74,222,128,0.4)] pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Zap ghost — highlight empty position where card was removed */}
        {lastZappedPosKey && (() => {
          const [gx, gy] = lastZappedPosKey.split(',').map(Number);
          if (board.has(lastZappedPosKey)) return null;
          const { left, top } = gridToPx(gx, gy);
          return (
            <motion.div
              key={`zap-ghost-${lastZappedPosKey}`}
              className="absolute pointer-events-none rounded-lg border-2 border-dashed border-red-400/60 bg-red-400/10"
              style={{
                left: `calc(50% + ${left}px - ${CARD_W / 2}px)`,
                top:  `calc(50% + ${top}px - ${CARD_H / 2}px)`,
                width: CARD_W,
                height: CARD_H,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          );
        })()}

        {/* Move-from ghost — highlight empty position where move-card picked up from */}
        {lastMovedFromPosKey && (() => {
          const [gx, gy] = lastMovedFromPosKey.split(',').map(Number);
          if (board.has(lastMovedFromPosKey)) return null;
          const { left, top } = gridToPx(gx, gy);
          return (
            <motion.div
              key={`move-ghost-${lastMovedFromPosKey}`}
              className="absolute pointer-events-none rounded-lg border-2 border-dashed border-red-400/60 bg-red-400/10"
              style={{
                left: `calc(50% + ${left}px - ${CARD_W / 2}px)`,
                top:  `calc(50% + ${top}px - ${CARD_H / 2}px)`,
                width: CARD_W,
                height: CARD_H,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          );
        })()}

        {/* Drop zones — valid placements */}
        {validPlacements.map(pos => {
          const key = posKey(pos.x, pos.y);
          const { left, top } = gridToPx(pos.x, pos.y);
          return (
            <button
              key={key}
              className="absolute pointer-events-auto rounded-lg border-2 border-dashed border-green-400/60 bg-green-400/10 hover:bg-green-400/25 hover:border-green-300 transition-colors"
              style={{
                left:   `calc(50% + ${left}px - ${CARD_W / 2}px)`,
                top:    `calc(50% + ${top}px - ${CARD_H / 2}px)`,
                width:  CARD_W,
                height: CARD_H,
              }}
              onClick={() => onDropZoneClick?.(pos)}
              title={`Place at (${pos.x}, ${pos.y})`}
            />
          );
        })}
      </div>

      {/* Hint when idle */}
      {validPlacements.length === 0 && !targetablePosKeys?.size && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="text-white/20 text-xs tracking-widest">{t('board.selectCard')}</p>
        </div>
      )}
    </div>
  );
}
