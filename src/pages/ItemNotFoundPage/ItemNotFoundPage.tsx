import Container from '../../ui/Container/Container';
import { IItemNotFoundPageProps } from '../types';

function ItemNotFoundPage({ type }: IItemNotFoundPageProps) {
  return (
    <Container>
      <div>{type} not found</div>;
    </Container>
  );
}

export default ItemNotFoundPage;
