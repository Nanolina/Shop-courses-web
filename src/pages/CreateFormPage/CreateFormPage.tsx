import axios from 'axios';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import { IOption } from '../../types';
import Container from '../../ui/Container/Container';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import ImageUpload from '../../ui/ImageUpload/ImageUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL;

function CreateFormPage() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const onSendData = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = tg.initDataUnsafe.user?.id;
      const userName = tg.initDataUnsafe.user?.username;
      const formData = new FormData();

      // Required fields
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price.toString());
      formData.append('currency', currency);

      // Optional fields
      if (userId) formData.append('userId', userId?.toString());
      if (userName) formData.append('userName', userName);
      if (subcategory) formData.append('subcategory', subcategory);
      if (description) formData.append('description', description);
      if (imageFile) formData.append('image', imageFile);

      // Request
      const courseApiUrl = `${serverUrl}/course`;
      const response = await axios.post(courseApiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Response
      if (response.status === 201) {
        const courseId = response.data.id;
        navigate(`/course/${courseId}`);
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }, [
    name,
    category,
    price,
    currency,
    subcategory,
    description,
    imageFile,
    navigate,
  ]);

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

  useEffect(() => {
    if (imagePreview) scroll.scrollToBottom();
  }, [imagePreview]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

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
