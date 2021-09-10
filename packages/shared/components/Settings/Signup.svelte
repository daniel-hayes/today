<script lang="ts">
  import { Field, ErrorMessage, Form } from 'svelte-forms-lib';
  import * as yup from 'yup';
  import { register } from '../../utils/auth';

  const formProps = {
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required('Email is required')
        .email('Email is invalid'),
      password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      register(values);
    },
  };
</script>

<Form {...formProps}>
  <label for="email">Email</label>
  <Field name="email" type="email" />
  <ErrorMessage name="email" />

  <label for="password">Password</label>
  <Field name="password" type="password" />
  <ErrorMessage name="password" />

  <ul>
    <li>Sync lists, settings and custom themes between devices</li>
    <li>View todo lists form the past (coming soon)</li>
  </ul>

  <button type="submit">Sign Up</button>
</Form>
