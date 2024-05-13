import { ChangeEvent } from 'react';
import { useCourseForm } from '../../hooks';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

function CreateCourseFormPage() {
  const {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    price,
    setPrice,
    currency,
    setCurrency,
    categoryOptions,
    subcategoryOptions,
    currencyOptions,
  } = useCourseForm();

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

export default CreateCourseFormPage;
