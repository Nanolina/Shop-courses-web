import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { IOption } from '../../types';
import Container from '../../ui/Container/Container';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import ImageUpload from '../../ui/ImageUpload/ImageUpload';
import Label from '../../ui/Label/Label';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

const tg = window.Telegram.WebApp;

function CreateFormPage() {
  const [longTitle, setLongTitle] = useState<string>('');
  const [shortTitle, setShortTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const setImage = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

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
      longTitle,
      shortTitle,
      description,
      category,
      subcategory,
      price,
      currency,
      imageFile,
    };
    tg.sendData(JSON.stringify(course));
  }, [
    category,
    currency,
    description,
    imageFile,
    longTitle,
    price,
    shortTitle,
    subcategory,
  ]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Create',
    });
  }, []);

  useEffect(() => {
    if (!shortTitle || !longTitle || !category || !price || !currency) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [category, currency, longTitle, price, shortTitle]);

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => {
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    scroll.scrollToBottom();
  }, [imagePreview]);

  return (
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
      <Label
        text="The main image for your course"
        style={{
          isCenter: true,
        }}
      />
      <ImageUpload onImageChange={setImage} />
      {imagePreview && (
        <ImagePreview
          imagePreview={imagePreview}
          removeImage={handleRemoveImage}
        />
      )}
    </Container>
  );
}

export default CreateFormPage;
