<script lang="ts">
  import { Field, ErrorMessage, Form } from 'svelte-forms-lib';
  import * as yup from 'yup';
  import { login } from '../../utils/firebase';

  let errorMessage = null;

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
      password: yup.string().required('Password is required'),
    }),
    onSubmit: async (values: { email: string; password: string }) => {
      // reset if error exists
      errorMessage = null;

      const error = await login(values);

      if (error) {
        errorMessage = error;
      }
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

  <button type="submit">submit</button>

  {#if errorMessage}
    {errorMessage}
  {/if}
</Form>
