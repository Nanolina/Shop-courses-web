import { ChangeEvent, useState } from 'react';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

function CreateFormPage() {
  const [longTitle, setLongTitle] = useState<string>('');
  const [shortTitle, setShortTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  return (
    <>
      <Header label="Create new course" hasButtonBack={false} />
      <Container>
        <TextInput
          value={longTitle}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setLongTitle(event.target.value)
          }
          placeholder="Full course title"
        />
        <TextInput
          value={shortTitle}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setShortTitle(event.target.value)
          }
          placeholder="Short course title"
        />
        <Textarea
          value={description}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setDescription(event.target.value)
          }
          placeholder="Description"
        />
      </Container>
    </>
  );
}

export default CreateFormPage;
