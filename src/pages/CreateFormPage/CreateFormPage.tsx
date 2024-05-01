import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IOption } from '../../types';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

const tg = window.Telegram.WebApp;

function CreateFormPage() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');

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

  const currencyOptions: IOption[] = [
    { value: 'TON', label: 'The Open Network (TON)' },
  ];

  const onSendData = useCallback(() => {
    const course = {
      name,
      description,
      category,
      subcategory,
      price,
      currency,
    };
    tg.sendData(JSON.stringify(course));
  }, [category, currency, description, name, price, subcategory]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Create',
    });
  }, []);

  useEffect(() => {
    if (!name || !category || !price || !currency) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [category, currency, name, price]);

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => {
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]);

  return (
    <Container>
      <TextInput
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
        placeholder="Course name"
      />
      <Textarea
        value={description}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(event.target.value)
        }
        placeholder="Description"
      />
      <Select
        type="category"
        selectValue={category}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          setCategory(event.target.value)
        }
        options={categoryOptions}
      />
      {category && category !== 'other' && (
        <Select
          type="subcategory"
          selectValue={subcategory}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setSubcategory(event.target.value)
          }
          options={subcategoryOptions[category]}
        />
      )}
      <Label
        text="Enter the cost"
        style={{
          isCenter: true,
        }}
      />
      <TextInput
        value={price}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setPrice(parseFloat(event.target.value) || 0)
        }
      />
      <Select
        type="currency"
        selectValue={currency}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(event.target.value)
        }
        options={currencyOptions}
      />
    </Container>
  );
}

export default CreateFormPage;
