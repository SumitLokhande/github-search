import './App.css'
import GitSearch from './GitSearch'
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
      <div className='min-h-screen bg-gray-100 p-5 my-5'>
        <div className='text-center'> <h1 className='text-3xl font-bold mb-4 p-4'>GitHub Repository Search</h1></div>
        <GitSearch />
      </div>
      <ToastContainer
        position="bottom-center"
      />
    </>
  )
}

export default App
