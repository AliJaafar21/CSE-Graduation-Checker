import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import './CoursesPage.css'
import CourseCreationAndEditingModal from './CourseCreationAndEditingModal'
import TagCell from './TagCell'
import CoursesPagination from './CoursesPagination'

const CoursesPage = ({ access_csrf }) => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [refresh, setRefresh] = useState(true)
  const [courses, setCourses] = useState([])
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [tag1, setTag1] = useState('No Tag')
  const [tag2, setTag2] = useState('No Tag')
  const [tag3, setTag3] = useState('No Tag')
  const [equivalentCourse, setEquivalentCourse] = useState('None')
  const [showCourseCreation, setShowCourseCreation] = useState(true)

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(30);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentCourses = courses.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(courses.length / recordsPerPage)

  const handleClose = () => setShow(false);
  const handleShow = (name, title, tag1, tag2, tag3, equivalent_to) => {
    setName(name)
    setTitle(title)
    setTag1(tag1)
    setTag2(tag2)
    setTag3(tag3)
    setEquivalentCourse(equivalent_to)
    setShow(true)
  }

  useEffect(() => {
    getCourses()
  }, [refresh])


  async function getCourses() {
    try {
      const response = await fetch(`${URL}courses/`)
      const data = await response.json()
      setCourses(data)
    } catch (error) { }
  }

  return (
    <div className='text-center bg-dark height-100'>
      <div className='text-center bg-dark '>
        <Table bordered hover variant="dark" className='table-fixed margin-0'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Equivalent Course</th>
            </tr>
          </thead>
          <tbody>
            {
              currentCourses.map(({ equivalent_to, name, tag1, tag2, tag3, title }) => {
                let subject = name.match(/\D+/g)
                let number = name.match(/\d+\D?/g)
                return <tr key={name} onClick={() => { setShowCourseCreation(false); handleShow(name, title, tag1, tag2, tag3, equivalent_to) }}>
                  <td>{subject ? subject[0] : ''} {number ? number[0] : ''}</td>
                  <td>{title}</td>
                  <TagCell tag1={tag1} tag2={tag2} tag3={tag3} />
                  <td>{equivalent_to ? equivalent_to : '-'}</td>
                </tr>
              })}
          </tbody>
        </Table>
      </div>

      <div className='bg-dark d-flex flex-wrap justify-content-center'>
        <CoursesPagination
          nPages={nPages}
          setCurrentPage={setCurrentPage}
        />
        <div className='text-center bg-dark w-100'>
          <Button variant="outline-info" className='create-course-btn' onClick={() => { setShowCourseCreation(true); handleShow('', '', 'No Tag', 'No Tag', 'No Tag', 'None') }}>
            Create New Course
          </Button>
        </div>
      </div>

      <CourseCreationAndEditingModal
        show={show} handleClose={handleClose}
        type={showCourseCreation}
        access_csrf={access_csrf}
        refresh={refresh} setRefresh={setRefresh}
        names={courses.map((course) => (course['name']))}
        name={name} setName={setName}
        title={title} setTitle={setTitle}
        tag1={tag1} setTag1={setTag1}
        tag2={tag2} setTag2={setTag2}
        tag3={tag3} setTag3={setTag3}
        equivalentCourse={equivalentCourse} setEquivalentCourse={setEquivalentCourse} />
    </div >
  )
}
export default CoursesPage