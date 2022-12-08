import React, {
  memo,
  useMemo,
} from 'react';

import { generateTrianglePoints } from '../../../helpers/generate-triangle-points';

import styles from './bar-fix-width.module.css';

type BarFixWidthProps = {   
  x: number;
  y: number;
  width: number;
  height: number;
  isLeft: boolean;
  color: string;
  onMouseDown: () => void;
};

const BarFixWidthInner: React.FC<BarFixWidthProps> = ({
  x,
  y,
  width,
  height,
  isLeft,
  color,
  onMouseDown,
}) => {
  const halfHeight = useMemo(
    () => Math.round(height / 2),
    [height],
  );

  const d = useMemo(() => {
    return `M ${x} ${y}
      v ${height}
      M ${x} ${y + halfHeight}
      h ${isLeft ? -width : width}
    `;
  }, [
    x,
    y,
    width,
    height,
    halfHeight,
    isLeft,
  ]);

  const trianglePoints = useMemo(
    () => generateTrianglePoints(
      isLeft ? x - width : x + width,
      y + halfHeight,
      5,
      isLeft,
    ),
    [
      x,
      y,
      width,
      halfHeight,
      isLeft,
    ],
  );

  return (
    <g
      className={styles.wrapper}
      fill={color}
      stroke={color}
      onMouseDown={onMouseDown}
    >
      <path
        d={d}
        className={styles.mainPath}
      />

      <path
        d={d}
        className={styles.clickZone}
      />

      <polygon points={trianglePoints} />
    </g>
  );
};

export const BarFixWidth = memo(BarFixWidthInner);
