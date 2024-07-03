import { TFunction } from 'i18next';

interface IGetTranslatedType {
  singular: string;
  plural: string;
  singular_genitive_case: string;
}

export const getTranslatedType = (
  type: string,
  t: TFunction
): IGetTranslatedType => {
  const singular = t(`types.${type}.singular`);
  const plural = t(`types.${type}.plural`);
  const singular_genitive_case = t(`types.${type}.singular_genitive_case`);
  return { singular, plural, singular_genitive_case };
};
