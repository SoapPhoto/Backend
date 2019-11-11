import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import * as Yup from 'yup';

import { theme } from '@lib/common/utils/themes';
import { Formik, FormikErrors } from 'formik';
import { Modal } from '../Modal';
import { FieldInput } from '../Formik';
import { Button } from '../Button';

interface IValues {
  make: string;
  model: string;
  focalLength: string;
  aperture: string;
  exposureTime: string;
  ISO: string;
}

interface IProps {
  visible: boolean;
  initialValues: IValues;
  onClose: () => void;
}

interface IFormProps {
  initialValues: IValues;
  onClose: () => void;
}

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  margin-bottom: ${rem(24)};
`;

const FormBox = styled.div`
  grid-template-columns: repeat(auto-fit, minmax(${rem(240)}, 1fr));
  display: grid;
  grid-gap: ${rem(16)};
`;

const Form: React.FC<IFormProps> = ({ initialValues, onClose }) => {
  const handleOk = async (value: IValues) => {
    console.log(value);
    onClose();
  };
  const FormSchema = Yup.object().shape({
    ISO: Yup.number(),
    aperture: Yup.number(),
    focalLength: Yup.number(),
  });

  const validate = async (value: IValues): Promise<FormikErrors<IValues>> => {
    const error: FormikErrors<IValues> = {

    };
    try {
      await FormSchema.validate(value, {
        abortEarly: false,
      });
    } catch (errors) {
      if (errors.inner) {
        errors.inner.forEach((err: any) => {
          if (err.type === 'typeError') {
            error[err.path as keyof IValues] = '请输入数字';
          }
        });
      }
    }
    return error;
  };

  return (
    <Formik<IValues>
      initialValues={initialValues}
      onSubmit={handleOk}
      validate={validate}
      validationSchema={FormSchema}
    >
      {({
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <FormBox>
            {
              Object.keys(initialValues).map((value: string) => (
                <FieldInput
                  key={value}
                  name={value}
                  label={value}
                />
              ))
            }
          </FormBox>
          <Button
            style={{ marginTop: rem(42), width: '100%' }}
            type="submit"
            disabled={isSubmitting}
          >
            更新
          </Button>
        </form>
      )}
    </Formik>
  );
};

export const EXIFEditModal: React.FC<IProps> = ({ visible, onClose, initialValues }) => (
  <Modal
    visible={visible}
    onClose={onClose}
    boxStyle={{ maxWidth: '560px' }}
  >
    <Title>EXIF 信息修改</Title>
    <Form onClose={onClose} initialValues={initialValues} />
  </Modal>
);
