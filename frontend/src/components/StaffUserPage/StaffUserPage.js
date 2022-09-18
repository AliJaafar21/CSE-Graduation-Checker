import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import CoursesPage from "../StaffUserPage/CoursesPage/CoursesPage"
import NavBar from '../NavBar'
import './StaffUserPage.css'
import Students from './StudentsPage/Students'

const StaffUserPage = ({ access_csrf, logout }) => {
  return (
    <div className='bg-dark height-100'>
      <NavBar logout={logout} />
      <Tabs defaultActiveKey="courses" className="bg-dark" justify >
        <Tab eventKey="courses" title="Courses" unmountOnExit={true} className="bg-dark">
          <CoursesPage access_csrf={access_csrf} />
        </Tab>
        <Tab eventKey="students" title="Students" unmountOnExit={true}>
          <Students access_csrf={access_csrf} />
        </Tab>
      </Tabs>
    </div>
  )
}
export default StaffUserPage
