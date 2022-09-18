import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
const NavBar = ({ logout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" className="font-weight-bold" >
      <Container>
        <Navbar.Brand className='blue cursor-pointer user-select-none white-on-hover' >
          CSE Graduation Checker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='blue' />
      </Container >
      <Navbar.Collapse id="responsive-navbar-nav" >
        <Button variant='outline-secondary' onClick={() => (logout())}>
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar >
  )
}
export default NavBar