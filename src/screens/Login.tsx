import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useContext, useState } from 'react';
import PlainInput from '../components/Inputs/PlainInput';
import { loginApi } from '../apis/TaskApis';
import { IUser } from '../types/userTypes';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login: FC = () => {
  const navigate = useNavigate();
  const { isAuthndicated } = useContext(AuthContext)

  const [errors, setErrors] = useState<Partial<IUser>>()
  const [user, setUser] = useState<IUser>({
    email: "",
    password: ""
  })

  const handleFormValidation = (): Boolean => {
    const newerrors: Partial<IUser> = {}
    if (!user.email) {
      newerrors.email = "Title is required"
    }
    if (!user.password) {
      newerrors.password = "Description is required"
    }
    setErrors(newerrors);
    return Object.keys(newerrors).length === 0;
  }

  const handleFocuse: FocusEventHandler<HTMLInputElement> = (event) => {
    const { name } = event.target;
    setErrors((preV) => ({
      ...preV, [name]: ""
    }))
  }

  const handelChanage: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (handleFormValidation()) {
      await loginApi(user).then((res) => {
        if (res && isAuthndicated) {
          navigate('/home');
        }
      }).catch(err => console.log(err))
    }
  }
  return (
    <section>
      <form className="max-w-sm mx-auto dark:bg-gray-900 bg-gray-100 " noValidate onSubmit={handleSubmit}>
        <h1 className='text-4xl font-bold dark:text-gray-50 text-gray-900 text-center'>Login</h1>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <PlainInput onForcus={handleFocuse} onChange={handelChanage} id='email' name='email' type='email' placeholder='Enter you email' />
          {errors?.email && <p className='text-red-600 text-sm mt-2'>{errors.email}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <PlainInput onForcus={handleFocuse} onChange={handelChanage} id='password' name='password' type='password' placeholder='Enter you password' />
          {errors?.password && <p className='text-red-600 text-sm mt-2'>{errors?.password}</p>}
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </section>
  )
}

export default Login;