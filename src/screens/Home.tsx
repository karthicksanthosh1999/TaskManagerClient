import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useContext, useState } from 'react'
import { createTaskApi, deleteTaskApi, getAllTaskApi, singleTaskApi, updateTaskApi } from '../apis/TaskApis'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ITask, ITaskResponse } from '../types/TaskTypes';
import { formatDateToYYYYMMDD } from '../helper/help';
import { Pencil, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import TableLoading from '../components/loading/TableLoading';
import OutlineButton from '../components/Buttons/OutlineButton';
import PlainInput from '../components/Inputs/PlainInput';
import Selects from '../components/Inputs/Selects';
import CancelButton from '../components/Buttons/CancelButton';
import DeleteModal from '../components/Modals/DeleteModal';
import AddButton from '../components/Buttons/AddButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: FC = () => {

  const { decodeToken, logout } = useContext(AuthContext);

  const statusOptions = [
    {
      value: "Queue",
      option: "Queue",
    },
    {
      value: "Pending",
      option: "Pending",
    },
    {
      value: "Completed",
      option: "Completed",
    }
  ]

  const navigate = useNavigate();
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<ITask>>()
  const [values, setValues] = useState<ITask>({
    title: "",
    description: "",
    status: "",
    dueDate: "",
    createdUser: decodeToken?.userId ?? ""
  });

  const queryClient = useQueryClient();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (handleFormValidation()) {
      mutation.mutate(values);
      closeCreateModal();
    }
  }


  const { data: taskData, isLoading: taskLoading } = useQuery<ITaskResponse[]>({
    queryKey: ['tasks'],
    queryFn: getAllTaskApi
  })

  const mutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ITask }) =>
      updateTaskApi(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      })
    }
  })

  const openDeleteModal = (id: string) => {
    setSelectedTask(id)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    handleFormReset()
    setIsDeleteModalOpen(false)
  }

  const openCreateModal = () => setCreateModalOpen(true)

  const closeCreateModal = () => {
    handleFormReset()
    setCreateModalOpen(false)
  }

  const openUpdateModal = async (id: string) => {
    const result = await singleTaskApi(id);
    setSelectedTask(id)
    setValues({
      description: result.description,
      dueDate: result.dueDate,
      title: result.title,
      status: result.status,
    })
    setUpdateModalOpen(true)
  }

  const closeUpdateModal = () => {
    handleFormReset()
    setUpdateModalOpen(false)
  }

  const handleFormReset = () => {
    setValues({
      createdUser: "",
      title: "",
      description: "",
      dueDate: "",
      status: "Queue",
    })
  }

  const handleFormValidation = (): Boolean => {
    const newerrors: Partial<ITask> = {}
    if (!values.title) {
      newerrors.title = "Title is required"
    }
    if (!values.description) {
      newerrors.description = "Description is required"
    }
    if (!values.status) {
      newerrors.status = "Status is required"
    }
    if (!values.dueDate) {
      newerrors.dueDate = "Due Date is required"
    }
    setErrors(newerrors);
    return Object.keys(newerrors).length === 0;
  }

  const handleFocuse: FocusEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
    const { name } = event.target;
    setErrors((preV) => ({
      ...preV, [name]: ""
    }))
  }

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
    const { name, value } = event.target
    setValues((preV) => ({
      ...preV, [name]: value
    }))
  }

  const handleDelete = () => {
    console.log(selectedTask)
    if (selectedTask) {
      deleteMutation.mutate(selectedTask)
      setSelectedTask(null)
      closeDeleteModal()
    }
  }

  const handleUpdate: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log('Clicked')
    if (selectedTask && handleFormValidation()) {
      updateMutation.mutate({ id: selectedTask, values });
      setSelectedTask(null)
      closeUpdateModal()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/');
  }

  return (
    <section>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-5">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <AddButton title='Add Task' type='button' onClick={openCreateModal} />
          <AddButton title='Logout' type='button' onClick={handleLogout} />
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sl.No
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              taskData && taskData.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <h1 className='text-4xl text-center mt-5'>Task Not Found</h1>
                  </td>
                </tr>
              ) : (
                taskLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <TableLoading />
                    </td>
                  </tr>
                ) : (
                  taskData && taskData?.map((item, i) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4">
                          {item.title}
                        </td>
                        <td className="px-6 py-4">
                          {item.description}
                        </td>
                        <td className="px-6 py-4">
                          {item.createdUser?.firstName}
                          {item.createdUser?.lastName}
                        </td>
                        <td className="px-6 py-4">
                          {formatDateToYYYYMMDD(item?.dueDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> {item.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className='flex gap-4'>
                            <Pencil className='cursor-pointer hover:text-gray-50' onClick={() => openUpdateModal(item?._id!)} />
                            <Trash className='cursor-pointer hover:text-gray-50' onClick={() => openDeleteModal(item?._id!)} />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )
              )
            }
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          id="default-modal"
          aria-hidden="true"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
        >
          <div className="relative p-4 w-full max-w-xl max-h-full">
            <form noValidate onSubmit={handleSubmit}>
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Create Task
                  </h3>
                  <CancelButton onClick={closeCreateModal} title={'close button'} type={'button'} />
                </div>
                <div className='p-5'>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Name :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='title' name='title' value={values.title} onChange={handleChange} type='text' placeholder='Task Name' />
                        {errors?.title && <p className='text-red-600 text-sm mt-2'>{errors.title}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Desciption :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='description' name='description' value={values.description} onChange={handleChange} type='text' placeholder='Task Name' />
                        {errors?.description && <p className='text-red-600 text-sm mt-2'>{errors.description}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Type :</h6>
                      <div className='col-span-3'>
                        <Selects onFocus={handleFocuse} id='status' name='status' value={values.status} onChange={handleChange} options={statusOptions} />
                        {errors?.status && <p className='text-red-600 text-sm mt-2'>{errors.status}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Value :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='dueDate' name='dueDate' value={values.dueDate} onChange={handleChange} type='date' placeholder='Task Value' />
                        {errors?.dueDate && <p className='text-red-600 text-sm mt-2'>{errors.dueDate}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                  <OutlineButton type='reset' title='Disacard' onclick={closeCreateModal} />
                  <OutlineButton type='submit' title='Add Task' />
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title='Delete Task'
        message='Are you sure you want to delete this Task?'
        onConfirm={handleDelete}
      />

      {isUpdateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          id="default-modal"
          aria-hidden="true"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
        >
          <div className="relative p-4 w-full max-w-xl max-h-full">
            <form noValidate onSubmit={handleUpdate}>
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow" >
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Update Task
                  </h3>
                  <CancelButton onClick={closeUpdateModal} title={'close button'} type={'button'} />
                </div>
                <div className='p-5'>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Name :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='title' name='title' value={values.title} onChange={handleChange} type='text' placeholder='Task Name' />
                        {errors?.title && <p className='text-red-600 text-sm mt-2'>{errors.title}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Description :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='description' name='description' value={values.description} onChange={handleChange} type='text' placeholder='Task Name' />
                        {errors?.description && <p className='text-red-600 text-sm mt-2'>{errors.description}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Task Status :</h6>
                      <div className='col-span-3'>
                        <Selects onFocus={handleFocuse} id='status' name='status' value={values.status} onChange={handleChange} options={statusOptions} />
                        {errors?.status && <p className='text-red-600 text-sm mt-2'>{errors.status}</p>}
                      </div>
                    </div>
                    <div className='grid grid-cols-5 justify-evenly items-center'>
                      <h6 className='col-span-2 text-sm dark:text-gray-400 text-gray-900 font-semibold'>Due Date :</h6>
                      <div className='col-span-3'>
                        <PlainInput onForcus={handleFocuse} id='dueDate' name='dueDate' value={formatDateToYYYYMMDD(values.dueDate)} onChange={handleChange} type='date' placeholder='Task Value' />
                        {errors?.dueDate && <p className='text-red-600 text-sm mt-2'>{errors.dueDate}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end px-5 py-3.5 items-center gap-2 border-t-2'>
                  <OutlineButton type='reset' title='Disacard' onclick={closeUpdateModal} />
                  <OutlineButton type='submit' title='Update Task' />
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </section>
  )
}

export default Home