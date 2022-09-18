import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
import StaffUserPage from './components/StaffUserPage/StaffUserPage'
import StudentUserPage from './components/StudentUserPage/StudentUserPage'
import { getAccessCsrf, saveAccessCsrf } from './LocalStorage'

const App = () => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [role, setRole] = useState('')
  const [access_csrf, setAccessCsrf] = useState(getAccessCsrf())


  async function logout() {
    try {
      const response = await fetch(`${URL}users/logout`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': access_csrf
        },
        method: 'POST',
        body: JSON.stringify({

        })
      })
      saveAccessCsrf(null)
      setAccessCsrf('')
      setRole('')
    } catch (error) { }
  }

  async function getRole() {

    const response = await fetch(`${URL}users/me/role`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': access_csrf,
      },
      credentials: 'include',
      method: 'POST',
    })
    const data = await response.json()
    if (response.status === 200) {
      return data.role
    }

    return ''
  }


  useEffect(() => {
    getRole().then((role) => setRole(role))
      .catch((error) => { })
  }, [])


  return (
    <div className='bg-dark my-font'>

      {(role === '' || access_csrf === '') &&
        < LandingPage setRole={setRole} access_csrf={access_csrf} setAccessCsrf={setAccessCsrf} />
      }

      {(access_csrf !== '' && role === 'STAFF') &&
        <StaffUserPage access_csrf={access_csrf} setAccessCsrf={setAccessCsrf} logout={logout} />
      }

      {(access_csrf !== '' && role === 'STUDENT') &&
        <StudentUserPage access_csrf={access_csrf} setAccessCsrf={setAccessCsrf} logout={logout} />
      }

    </div >
  )
}
export default App