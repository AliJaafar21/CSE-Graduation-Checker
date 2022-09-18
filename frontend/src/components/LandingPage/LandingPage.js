import { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import NavDropdown from 'react-bootstrap/NavDropdown'
import './LandingPage.css'
import { getAccessCsrf, saveAccessCsrf } from '../../LocalStorage'

const LandingPage = ({ setRole, setAccessCsrf, setRefreshCsrf }) => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [pageToShow, setPageToShow] = useState(0);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [AUBNET_id, setAUBNET_id] = useState('')
  const [id_Number, setId_Number] = useState('')
  const [remember, setRemember] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function resetState() {
    setPageToShow(0);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setAUBNET_id('');
    setId_Number('');
    setRemember(false);
    setErrorMessage('');
  }

  function preventSpace(event) {
    if (event.code === 'Space') {
      event.preventDefault()
    }
  }

  async function login(email, password) {
    try {
      const response = await fetch(`${URL}users/login`, {
        headers: {
          "accepts": "application/json",
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      const data = await response.json()
      if (response.status === 200) {
        setAccessCsrf(data.access_csrf)
        setRole(data.role)
        if (remember) {
          saveAccessCsrf(data.access_csrf)
        }
      }
      else if (data.error) {
        setErrorMessage(data.error)
      }
    } catch (error) { }
  }


  async function registerStaff() {
    if (password !== password2) {
      setErrorMessage('Passwords Don\'t Match')
      return
    }
    try {
      const response = await fetch(`${URL}users/staff-registration`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
      })
      const data = await response.json()
      if (response.status === 201) {
        login(email, password)
      }
      else if (data.error) {
        setErrorMessage(data.error)
      }
    } catch (error) { }
  }

  async function registerStudent() {
    if (password !== password2) {
      setErrorMessage('Passwords Don\'t Match')
      return
    }
    try {
      const response = await fetch(`${URL}users/student-registration`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          AUBNet_id: AUBNET_id,
          id_number: id_Number
        })
      })
      const data = await response.json()
      if (response.status === 201) {
        login(email, password)
      }
      else if (data.error) {
        setErrorMessage(data.error)
      }
    } catch (error) { }
  }

  return (
    <div className='d-flex flex-column main-div overflow-hidden'>
      <Navbar collapseOnSelect expand="lg" bg="dark" className="font-weight-bold">
        <Container>
          <Navbar.Brand className='blue cursor-pointer user-select-none white-on-hover' onClick={() => (resetState())}>
            CSE Graduation Checker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </Container >
        <Navbar.Collapse id="responsive-navbar-nav" >
          <NavDropdown title="Signup" id="collasible-nav-dropdown">
            <NavDropdown.Item onClick={() => { resetState(); setPageToShow(3); }}>Students</NavDropdown.Item>
            <NavDropdown.Item onClick={() => { resetState(); setPageToShow(2); }}>Staff</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={() => { resetState(); setPageToShow(1) }}>Login</Nav.Link>
        </Navbar.Collapse>
      </Navbar >


      {
        pageToShow === 0 &&
        <div className='title-container'>
          <h1 className=' title user-select-none text-black' >Welcome To CSE Graduation Checker</h1>
        </div>
      }


      {
        pageToShow === 1 &&
        <div className='my-container my-flex-direction' >
          <div className='login-first login-background' >
          </div>
          <Card className='login-second d-flex justify-content-center align-items-center'>
            {errorMessage !== '' &&
              <Alert variant='danger' className="w-75 text-center">
                {errorMessage}
              </Alert>
            }
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={({ target }) => (setEmail(target.value))} onKeyDown={(event) => (preventSpace(event))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" onChange={({ target }) => (setPassword(target.value))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Remember me" onChange={({ target }) => (setRemember(target.checked))} />
              </Form.Group>
              <div className="text-right">
                <Button variant="primary" onClick={() => (login(email, password))}>
                  Login
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      }


      {
        pageToShow === 2 &&
        <div className='my-container my-flex-direction' >
          <div className='staff-signup-first signup-staff-background'>
          </div>
          <Card className='staff-signup-second d-flex justify-content-center align-items-center'>
            {errorMessage !== '' &&
              <Alert variant='danger' className="w-75 text-center">
                {errorMessage}
              </Alert>
            }
            <Form>
              <Form.Group className="mb-3" >
                <Form.Label>First Name</Form.Label>
                <Form.Control type="email" placeholder="Enter First Name" onChange={({ target }) => (setFirstName(target.value))} onKeyDown={(event) => (preventSpace(event))} />
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="email" placeholder="Enter Last Name" onChange={({ target }) => (setLastName(target.value))} onKeyDown={(event) => (preventSpace(event))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={({ target }) => (setEmail(target.value))} onKeyDown={(event) => (preventSpace(event))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" onChange={({ target }) => (setPassword(target.value))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" onChange={({ target }) => (setPassword2(target.value))} />
              </Form.Group>
              <div className="text-right">
                <Button variant="primary" onClick={() => registerStaff()}>
                  Signup
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      }


      {
        pageToShow === 3 &&
        <div className='my-container my-flex-direction' >
          <div className='student-signup-first signup-students-background'>
          </div>
          <Card className='student-signup-second d-flex justify-content-center align-items-center'>
            <Form className='margin-8-percent'>
              {errorMessage !== '' &&
                <Alert variant='danger' className="w-100 text-center">
                  {errorMessage}
                </Alert>
              }

              <Row>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="email" placeholder="Enter First Name" onChange={({ target }) => (setFirstName(target.value))} onKeyDown={(event) => (preventSpace(event))} />
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="email" placeholder="Enter Last Name" onChange={({ target }) => (setLastName(target.value))} onKeyDown={(event) => (preventSpace(event))} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label>AUBNET ID</Form.Label>
                  <Form.Control type="email" placeholder="Enter AUBNET ID" onChange={({ target }) => (setAUBNET_id(target.value))} onKeyDown={(event) => (preventSpace(event))} />
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control type="email" placeholder="Enter ID Number" onChange={({ target }) => (setId_Number(target.value))} onKeyDown={(event) => (preventSpace(event))} />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={({ target }) => (setEmail(target.value))} onKeyDown={(event) => (preventSpace(event))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" onChange={({ target }) => (setPassword(target.value))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" onChange={({ target }) => (setPassword2(target.value))} />
              </Form.Group>
              <div className="text-right">
                <Button variant="primary" onClick={() => registerStudent()}>
                  Signup
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      }

    </div >
  )
}
export default LandingPage
