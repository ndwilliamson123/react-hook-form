import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

const blockedDomains = ["blocked.com", "hacker.com", "mrstealyourcode.io"];

const validationRules = {
  fullName: {
    required: { value: true, message: "Full Name is required" },
    maxLength: { value: 40, message: "40 character limit" },
  },
  email: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value:
        /^[\w\.-]+(\+[\w\.-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/,
      message: "Invalid email format.",
    },
    validate: {
      notBlocked: (fieldValue: string) =>
        blockedDomains.indexOf(
          fieldValue.substring(fieldValue.indexOf("@") + 1)
        ) > -1
          ? "This domain is blocked"
          : true,
    },
  },
  phoneNumber: {
    minLength: { value: 12, message: "Please enter a 10 digit phone number" },
    maxLength: { value: 12, message: "Please enter a 10 digit phone number" },
  },
};

export default function App(): ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const userPhoneInput = watch("phoneNumber", "");

  const formatPhoneNumber = (input: string) => {
    const digitsOnly = input.replace(/\D/g, "");
    const formattedNumber = formatPhoneNumberWithHyphens(digitsOnly);
    return formattedNumber;
  };

  const formatPhoneNumberWithHyphens = (input: string) => {
    const areaCode = input.slice(0, 3);
    const firstPart = input.slice(3, 6);
    const secondPart = input.slice(6, 10);

    if (input.length < 4) {
      return `${areaCode}`;
    } else if (input.length < 7) {
      return `${areaCode}-${firstPart}`;
    }
    return `${areaCode}-${firstPart}-${secondPart}`;
  };

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
          {...register("fullName", validationRules.fullName)}
        />
        {errors.fullName && (
          <p className="form__field-error">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="example@company.com"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email", validationRules.email)}
        />
        {errors.email && (
          <p className="form__field-error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="text"
          inputMode="tel"
          placeholder="123-867-5309"
          aria-invalid={errors.phoneNumber ? "true" : "false"}
          value={formatPhoneNumber(userPhoneInput)}
          {...register("phoneNumber", validationRules.phoneNumber)}
        ></input>
        {errors.phoneNumber && userPhoneInput.length !== 12 && (
          <p className="form__field-error">{errors.phoneNumber.message}</p>
        )}
      </div>

      <input type="submit" />
    </form>
  );
}
