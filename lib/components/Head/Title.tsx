import React from 'react';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps {
  title: string;
}

export const Title: React.FC<IProps> = ({
  title,
}) => {
  const { t } = useTranslation();
  return (
    <title>{`${t(title)} - ${t('title.name')}`}</title>
  );
};
