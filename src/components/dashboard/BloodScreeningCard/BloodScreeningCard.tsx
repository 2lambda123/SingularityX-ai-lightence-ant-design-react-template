import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { BloodScreeningChart } from './BloodScreeningChart/BloodScreeningChart';
import { Cell, BloodScreeningTable } from './BloodScreeningTable/BloodScreeningTable';
import { media } from '../../../styles/theme';
import * as S from './BloodScreeningCard.styles';

export const BloodScreeningCard: React.FC = () => {
  const isTablet = useMediaQuery({ query: media.md });

  const [activeItem, setActiveItem] = useState<Cell>({
    key: 0,
    values: {
      min: 80,
      current: 90,
      cellName: 'Red blood cells',
    },
    data: [410, 466, 455, 467, 649, 670, 620, 600, 500, 400, 500, 700],
  });

  return (
    <S.Card title={!isTablet && 'Blood screening'} padding={0}>
      <S.Badge>{activeItem.values.cellName}</S.Badge>
      <BloodScreeningChart activeItem={activeItem} />
      <BloodScreeningTable activeItem={activeItem} setActiveItem={setActiveItem} />
    </S.Card>
  );
};