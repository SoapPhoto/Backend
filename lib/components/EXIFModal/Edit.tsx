import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import * as Yup from 'yup';

import { theme } from '@lib/common/utils/themes';
import { Formik, FormikErrors } from 'formik';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Modal } from '../Modal';
import { FieldInput } from '../Formik';
import { Button } from '../Button';

type ValueType = string | number | undefined;

export interface IEXIFEditValues {
  make: ValueType;
  model: ValueType;
  focalLength: ValueType;
  aperture: ValueType;
  exposureTime: ValueType;
  ISO: ValueType;
}

interface IProps {
  visible: boolean;
  initialValues: Partial<IEXIFEditValues>;
  onClose: () => void;
  onOk: (value: IEXIFEditValues) => void;
}

interface IFormProps {
  initialValues: Partial<IEXIFEditValues>;
  onClose: () => void;
  onOk: (value: IEXIFEditValues) => void;
}
const init = {
  make: '',
  model: '',
  focalLength: undefined,
  aperture: undefined,
  exposureTime: '',
  ISO: undefined,
};

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  margin-bottom: ${rem(24)};
`;

const FormBox = styled.div`
  grid-template-columns: repeat(auto-fit, minmax(${rem(240)}, 1fr));
  display: grid;
  grid-gap: ${rem(16)};
`;

const Form: React.FC<IFormProps> = ({ initialValues, onClose, onOk }) => {
  const { t } = useTranslation();
  const FormSchema = Yup.object().shape({
    ISO: Yup.number(),
    aperture: Yup.number(),
    focalLength: Yup.number(),
  });

  const handleOk = async (value: IEXIFEditValues) => {
    onClose();
    onOk(FormSchema.cast(value) as IEXIFEditValues);
  };

  const validate = async (value: IEXIFEditValues): Promise<FormikErrors<IEXIFEditValues>> => {
    const error: FormikErrors<IEXIFEditValues> = {

    };
    try {
      await FormSchema.validate(value, {
        abortEarly: false,
      });
    } catch (errors) {
      if (errors.inner) {
        errors.inner.forEach((err: any) => {
          if (err.type === 'typeError') {
            error[err.path as keyof IEXIFEditValues] = '请输入数字';
          }
        });
      }
    }
    return error;
  };

  return (
    <Formik<IEXIFEditValues>
      initialValues={{ ...init, ...initialValues }}
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
              Object.keys(init).map((value: string) => (
                <FieldInput
                  key={value}
                  name={value}
                  label={t(`picture_info.${value}`)}
                />
              ))
            }
          </FormBox>
          <Button
            style={{ marginTop: rem(42), width: '100%' }}
            type="submit"
            disabled={isSubmitting}
          >
            修改
          </Button>
        </form>
      )}
    </Formik>
  );
};

export const EXIFEditModal: React.FC<IProps> = ({
  visible, onClose, initialValues, onOk,
}) => (
  <Modal
    visible={visible}
    onClose={onClose}
    boxStyle={{ maxWidth: '560px' }}
  >
    <Title>EXIF 信息修改</Title>
    <Form onOk={onOk} onClose={onClose} initialValues={initialValues} />
  </Modal>
);
