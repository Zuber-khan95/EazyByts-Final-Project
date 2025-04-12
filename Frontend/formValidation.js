import * as Yup from 'yup';

const signupSchema = Yup.object().shape({
  username: Yup.string().min(5,'Username must be at least 5 characters long').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
 password:Yup.string().required('Password is required').min(6,'Password must be at least 6 characters long') .matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
    'Password must contain at least one letter a-z or A-Z, one number 0-9, and one special character like @ $ % etc',
  )
});

const eventSchema=Yup.object().shape({
    title:Yup.string().min(3,"Title must have at least 3 characters.")
    .max(30,"Title must have max 30 characters.")
    .required("Title is required"),
    description:Yup.string().min(10,"Description must have at least 10 characters.")
    .max(50,"Description must have max 50 characters.")
    .required("Description is required"),
    location:Yup.string().min(3,"Location must have at least 3 characters.")
    .max(20,"Location must have max 20 characters.")
    .required("Location is required"),
    price:Yup.number().min(0,"Price must be more than 0.")
    .required("Price is required"),
    availableTickets:Yup.number().min(1,"available Tickets must be more than 0.")
    .required("available tickets is required"),
    category:Yup.string().required("pls choose any one from above in options."),
    status:Yup.string().required("pls choose any one from above in options."),
    startDate:Yup.date().required("Starting date is required"),
    endDate:Yup.date().required("End date is required").min(Yup.ref('startDate'),"End date can not be earlier than start date"),
});

const loginSchema=Yup.object().shape({
  username: Yup.string().min(5,'Your username must be of more than 5 character if you are alreday a registered user on BookMyEvent ')
  .required('Username is required'),
  password:Yup.string().required('Password is required').min(6,'Your password must be at least 6 characters long if you are alreday a registered user on BookMyEvent') .matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
    'Password must contain at least one letter a-z or A-Z, one number 0-9, and one special character like @ $ % etc',
  )
})

export {signupSchema,eventSchema,loginSchema}; 