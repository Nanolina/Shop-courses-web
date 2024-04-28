import { ChangeEvent, useState } from 'react';
import Header from '../../components/Header/Header';
import { IOption } from '../../types';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import Select from '../../ui/Select/Select';
import TextArea from '../../ui/TextArea/TextArea';
import TextInput from '../../ui/TextInput/TextInput';

function CreateFormPage() {
  const [longTitle, setLongTitle] = useState<string>('');
  const [shortTitle, setShortTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');

  const categoryOptions: IOption[] = [
    { value: 'technology', label: 'Technology' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'art', label: 'Art and design' },
    { value: 'other', label: 'Other' },
  ];

  const subcategoryOptions: Record<string, IOption[]> = {
    technology: [
      { value: 'full-stack', label: 'Full-stack development' },
      { value: 'data-science', label: 'Data Science' },
      { value: 'other', label: 'Other' },
    ],
    cooking: [
      { value: 'baking', label: 'Baking' },
      { value: 'grilling', label: 'Grilling' },
      { value: 'other', label: 'Other' },
    ],
    art: [
      { value: 'painting', label: 'Painting' },
      { value: 'sculpture', label: 'Sculpture' },
      { value: 'other', label: 'Other' },
    ],
    other: [],
  };

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
        <TextArea
          value={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
          placeholder="Description"
        />
        <Label
          text="Choose a category"
          style={{
            isCenter: true,
          }}
        />
        <Select
          selectValue={category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setCategory(event.target.value)
          }
          options={categoryOptions}
        />
        {category && category !== 'other' && (
          <Select
            selectValue={subcategory}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setSubcategory(event.target.value)
            }
            options={subcategoryOptions[category]}
          />
        )}
      </Container>
    </>
  );
}

export default CreateFormPage;
