import * as yup from "yup"
import { Form, Formik } from "formik"
import Button from "@/web/components/Button.jsx"
import FormField from "@/web/components/FormField.jsx"
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import FormError from "@/web/components/FormError.jsx"

const defaultInitialValues = {
  username: "",
  password: "",
}

const defaultValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Enter a username please")
    .label("username"),
  password: yup.string().required("Enter a password please").label("Password"),
})

const LoginForm = (props) => {
  const {
    onSubmit,
    initialValues = defaultInitialValues,
    validationSchema = defaultValidationSchema,
    error,
  } = props

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <>
        <FormError error={error} />
        <Form className="flex flex-col gap-4 p-4">
          <FormField
            name="email"
            type="text"
            label="E-mail"
            icon={faEnvelope}
          />
          <FormField
            name="password"
            type="password"
            label="Password"
            icon={faLock}
          />
          <Button type="submit">Se connecter</Button>
        </Form>
      </>
    </Formik>
  )
}

export default LoginForm