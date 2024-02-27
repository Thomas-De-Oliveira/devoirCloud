import * as yup from "yup"
import { Form, Formik } from "formik"
import Button from "@/web/components/Button.jsx"
import FormField from "@/web/components/FormField.jsx"
import FormError from "@/web/components/FormError.jsx"

const defaultInitialValues = {
  username: "",
  password: ""
};

const defaultValidationSchema = yup.object().shape({
  username: yup.string().required("Enter a username please").label("username"),
  password: yup.string().required("Enter a password please").label("Password")
});

const LoginForm = (props) => {
  const { onSubmit, initialValues = defaultInitialValues, validationSchema = defaultValidationSchema, error } = props

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {() => (
        <Form className="mx-auto w-96 bg-white shadow-md rounded border-2 border-rose-300 p-8">
          <FormError error={error} />
          <div className="mb-4">
            <FormField name="username" type="text" label="Username" placeholder="Enter your username" />
          </div>
          <div className="mb-6">
            <FormField name="password" type="password" label="Password" placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit" className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;