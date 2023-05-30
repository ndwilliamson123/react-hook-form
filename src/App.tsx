import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

type FormValues = {
  fullName: string;
  email: string;
};

export default function App(): ReactElement {
  const blockedDomains = ["blocked.com", "hacker.com", "mrstealyourcode.io"];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          type="text"
          placeholder="Nick"
          aria-invalid={errors.fullName ? "true" : "false"}
          {...register("fullName", {
            required: {
              value: true,
              message: "Full Name is required",
            },
            maxLength: { value: 40, message: "40 character limit" },
          })}
        />
        {errors.fullName && (
          <p className="form__field-error">
            {errors.fullName?.message?.toString()}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="example@company.com"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
            pattern: {
              value:
                /^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/,
              message: "Invalid email format.",
            },
            validate: {
              notBlocked: (fieldValue) => {
                return blockedDomains.indexOf(
                  fieldValue.substring(fieldValue.indexOf("@"))
                ) > -1
                  ? true
                  : "This domain is blocked";
              },
            },
          })}
        />
        {errors.email && (
          <p className="form__field-error">
            {errors.email?.message?.toString()}
          </p>
        )}
      </div>
      <input type="submit" />
    </form>
  );
}
