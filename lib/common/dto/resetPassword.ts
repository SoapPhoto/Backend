import * as Yup from 'yup';

export const ResetPasswordSchema = (isPassword: boolean) => {
  const initData: Yup.ObjectSchemaDefinition<any> = {
    newPassword: Yup.string()
      .min(6, '请输入正确的密码')
      .max(26, '请输入正确的密码')
      .required('请输入正确的密码'),
    repeatPassword: Yup.string()
      .min(6, '请输入正确的密码')
      .max(26, '请输入正确的密码')
      .required('请输入正确的密码'),
  };
  if (isPassword) {
    initData.password = Yup.string()
      .min(6, '请输入正确的密码')
      .max(26, '请输入正确的密码')
      .required('请输入正确的密码');
  }
  return Yup.object().shape(initData);
};
