import { TonConnectButton } from '@tonconnect/ui-react';
import { ChangeEvent, useEffect } from 'react';
import { categoryOptions, subcategoryOptions } from '../../category-data';
import { useCourseForm } from '../../hooks';
import { IUseCourseFormReturnType } from '../../pages/types';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import Header from '../Header/Header';
import styles from './CourseForm.module.css';

function CourseForm({ item }: { item?: ICourse }) {
  const {
    name,
    setName,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    price,
    setPrice,
    currency,
    setCurrency,
    currencyOptions,
    handleImageChange,
    previewUrl,
    setPreviewUrl,
    setImage,
    isLoading,
    error,
  } = useCourseForm() as IUseCourseFormReturnType;

  // Установка начальных значений из item
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setImageUrl(item.imageUrl || '');
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setPrice(item.price);
      setCurrency(item.currency);
      // setPreviewUrl(item.previewUrl || '');
      // setImage(item.image || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    item,
    setName,
    setDescription,
    setImageUrl,
    setCategory,
    setSubcategory,
    setPrice,
    setCurrency,
    // setPreviewUrl,
    // setImage,
  ]);

  if (isLoading) return <Loader />;

  return (
    <Container>
      <Header />
      <TextInput
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
        placeholder="Course name"
        isRequired
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
        isRequired
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
      <Label text="Enter the cost" isCenter={true} isRequired />
      <TextInput
        value={price}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setPrice(parseFloat(event.target.value) || 0)
        }
        isRequired
      />
      <Select
        type="currency"
        selectValue={currency}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(event.target.value)
        }
        options={currencyOptions}
        isRequired
      />
      <Label text="You can insert a link to the image or send the image as a file. The file size should be no more than 500KB. File format - jpeg or png" />
      <TextInput
        value={imageUrl}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setImageUrl(event.target.value)
        }
        placeholder="Cover URL for the course"
      />
      <InputUpload
        name={name}
        onChange={handleImageChange}
        acceptFiles="image/*"
      />
      {previewUrl && (
        <div className={styles.image}>
          <ImagePreview
            imagePreview={previewUrl}
            removeImage={() => {
              setImage(null);
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }}
          />
        </div>
      )}
      <div className={styles.walletContainer}>
        <Label
          text="Connect the wallet where you want to receive funds for the sale of this course"
          isCenter={true}
          isRequired
        />
        <TonConnectButton />
      </div>
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default CourseForm;
