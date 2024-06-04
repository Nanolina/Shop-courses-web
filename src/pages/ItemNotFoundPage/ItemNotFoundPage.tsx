import Container from '../../ui/Container/Container';
import { IItemNotFoundPageProps } from '../types';

function ItemNotFoundPage({ type, isMany }: IItemNotFoundPageProps) {
  return (
    <Container>
      {type}
      {isMany && 's'} not found
    </Container>
  );
}

export default ItemNotFoundPage;
