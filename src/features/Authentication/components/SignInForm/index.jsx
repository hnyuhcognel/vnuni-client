import axios from 'axios'
import { FastField, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import InputField from '../../../../custom-fields/InputField'
import './styles.scss'

export default function SignInForm(props) {
  const { initialValues, handleSign, handleIsSignedIn } = props
  const validationSchema = Yup.object().shape({
    signInUsername: Yup.string()
      .matches(/([A-Z]|[a-z]|\.|\_)\w+/g, {
        message: 'Tên tài khoản chỉ có thể chứa các ký tự: a-z, A-Z, _, .',
      })
      .min(5, 'Tên tài khoản phải có ít nhất 5 ký tự!')
      .max(32, 'Tên tài khoản chỉ có thể có tối đa 32 ký tự!')
      .required('Vui lòng nhập tên tài khoản!'),
    signInPassword: Yup.string()
      .matches(/[.^\S]/g, { message: 'Mật khẩu không được có khoảng trắng' })
      .min(5, 'Mật khẩu phải có ít nhất 5 ký tự!')
      .max(32, 'Mật khẩu chỉ có thể có tối đa 32 ký tự!')
      .required('Vui lòng nhập mật khẩu!'),
  })

  const handleSignInSubmit = async (values, actions) => {
    try {
      const result = await axios.post('http://localhost:8000/taikhoan/dangnhap', {
        username: values.signInUsername,
        password: values.signInPassword,
      })
      handleIsSignedIn()
      console.log(result.data.token)
      localStorage.setItem('token', result.data.token)
    } catch (error) {
      if (error.response.data.fail === 'username hoac password khong chinh xac') {
        actions.setErrors({
          signInUsername: 'Tài khoản hoặc mật khẩu không chính xác!',
          signInPassword: ' ',
        })
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSignInSubmit}
    >
      {(formikProps) => {
        const { values, errors, touched, isSubmitting, actions } = formikProps
        console.log('SignInForm ~ actions', actions)
        return (
          <Form className='sign-in__form'>
            <FastField name='signInUsername' component={InputField} placeholder='Tên tài khoản' />
            <FastField
              name='signInPassword'
              component={InputField}
              type='password'
              placeholder='Mật khẩu'
            />
            <button className='myBtn' color='primary' type='submit'>
              Đăng nhập
            </button>
            <div className='line'></div>
            <p>Bạn chưa có tài khoản?</p>
            <button className='myBtn' color='success' onClick={handleSign}>
              Tạo tài khoản mới
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}
