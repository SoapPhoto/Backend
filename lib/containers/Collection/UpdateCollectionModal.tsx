import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { Modal } from '@lib/components/Modal';
import { theme } from '@lib/common/utils/themes';
import { Formik, FormikHelpers } from 'formik';
import { FieldInput, FieldSwitch } from '@lib/components/Formik';
import { useTranslation } from '@lib/i18n/useTranslation';
import { IconButton, Button } from '@lib/components/Button';
// import { Trash2 } from '@lib/icon';
// import { useTheme } from '@lib/common/utils/themes/useTheme';
import { DeleteCollection } from '@lib/schemas/mutations';
import { UpdateCollectionDot } from '@lib/common/interfaces/collection';
import Toast from '@lib/components/Toast';
import { UpdateCollectionSchema } from '@lib/common/dto/collection';
import { Confirm } from '@lib/components/Confirm';
import { useRouter } from '@lib/router';
import { useAccountStore } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { Trash2 } from '@lib/icon';
import { useApolloClient } from 'react-apollo';

interface IProps<T> {
  id: number;
  visible: boolean;
  onClose: () => void;
  onUpdate: (value: T) => Promise<void>;
  defaultValue: T;
}

type IValues = UpdateCollectionDot;

const Wrapper = styled.div``;

const Title = styled.h2`
  font-size: ${props => rem(theme('fontSizes[3]')(props))};
  padding: ${rem('24px')};
`;

const Content = styled.div`
  padding: ${rem('24px')};
  padding-top: 0;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${rem(24)};
`;

export const UpdateCollectionModal: React.FC<IProps<UpdateCollectionDot>> = ({
  id,
  visible,
  onClose,
  onUpdate,
  defaultValue,
}) => {
  const client = useApolloClient();
  const { replaceRoute } = useRouter();
  const { userInfo } = useAccountStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = React.useState(false);
  const [deleteConfirmDisabled, setDeleteConfirmDisabled] = React.useState(false);
  // const { colors } = useTheme();
  const handleOk = useCallback(async (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(true);
    try {
      await onUpdate(value);
      onClose();
      Toast.success(t('btn.update_success'));
    } catch (error) {
      setSubmitting(false);
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  }, [onClose, onUpdate, t]);
  const deleteConfirm = useCallback(async () => {
    if (deleteConfirmLoading) return;
    setDeleteConfirmLoading(true);
    await client.mutate({
      mutation: DeleteCollection,
      variables: {
        id,
      },
    });
    Toast.success('删除成功！');
    setDeleteConfirmLoading(false);
    setDeleteConfirmDisabled(true);
    await replaceRoute(`/@${userInfo!.username}`);
    window.scrollTo(0, 0);
  }, [client, deleteConfirmLoading, id, replaceRoute, userInfo]);
  return (
    <Modal
      boxStyle={{ maxWidth: rem(500), padding: 0 }}
      visible={visible}
      onClose={onClose}
    >
      <Wrapper>
        <Title>{t('collection.edit.title')}</Title>
        <Content>
          <Formik<IValues>
            initialValues={defaultValue}
            onSubmit={handleOk}
            validationSchema={UpdateCollectionSchema(t)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <>
                <FieldInput
                  name="name"
                  label={t('collection.label.name')}
                  style={{ marginBottom: rem(24) }}
                />
                <FieldInput
                  name="bio"
                  label={t('collection.label.bio')}
                  style={{ marginBottom: rem(32) }}
                />
                <FieldSwitch
                  name="isPrivate"
                  label={t('private')}
                  bio={t('message.visible_yourself', t('label.collection'))}
                />
                <Footer>
                  <IconButton
                    popover={t('collection.delete')}
                    onClick={() => setConfirmVisible(true)}
                  >
                    <Trash2
                      color={colors.danger}
                    />
                  </IconButton>
                  <Button
                    loading={confirmLoading}
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {t('btn.save')}
                  </Button>
                </Footer>
              </>
            )}
          </Formik>
        </Content>
      </Wrapper>
      <Confirm
        title={t('delete_confirm', t('label.collection'))}
        visible={confirmVisible}
        confirmText={t('btn.delete')}
        confirmProps={{
          disabled: deleteConfirmDisabled,
          danger: true,
          onClick: deleteConfirm,
        }}
        confirmLoading={deleteConfirmLoading}
        confirmIcon={<Trash2 size={14} />}
        onClose={() => setConfirmVisible(false)}
      />
    </Modal>
  );
};
