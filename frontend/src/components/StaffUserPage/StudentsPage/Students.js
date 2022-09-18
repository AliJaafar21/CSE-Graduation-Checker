import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import './Students.css'
import GraduationRequirementsExamination from '../../StudentUserPage/GraduationRequirementsExamination'

const Students = ({ access_csrf }) => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [students, setStudents] = useState([])
  const [evaluation, setEvaluation] = useState()
  const [showTakenCourses, setshowTakenCourses] = useState(true)

  async function getStudents() {
    try {
      const response = await fetch(`${URL}students/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json()
      data.map(({ taken_courses }) => (taken_courses.sort((a, b) => (a.name > b.name ? 1 : -1))))
      setStudents(data)
    } catch (error) { }
  }


  async function checkGraduationRequirements(AUBNet_id) {
    try {
      const response = await fetch(`${URL}students/${AUBNet_id}/graduation-requirements-examination`, {
        headers: {
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json()
      if (response.status === 200) {
        setEvaluation(data)
        setshowTakenCourses(false)
      }
    } catch (error) { }
  }

  useEffect(() => {
    getStudents()
  }, [])

  return (
    <Accordion className='d-flex flex-column bg-dark text-white'>
      <br />
      {
        students.map(({ AUBNet_id, id_number, taken_courses, user }, index) => (
          <Accordion.Item eventKey={index} className='bg-dark text-white border border-primary item-margins' key={index} onClick={() => (setshowTakenCourses(true))}>
            <Accordion.Header>{user.firstName} {user.lastName} - {user.email}</Accordion.Header>
            <Accordion.Body >
              {showTakenCourses ?
                <>
                  <h5>ID Number: {id_number}</h5>
                  <h5>Taken Courses: {taken_courses.length}</h5>
                  <div className='d-flex flex-wrap'>
                    {
                      taken_courses.map(({ name }) => (
                        <h3 key={name} className='badge-container-margins'><Badge bg="primary" >{name}</Badge></h3>
                      ))
                    }

                  </div>
                  <br />
                  <Button as='div' variant='outline-success' onClick={() => (checkGraduationRequirements(AUBNet_id))}>
                    Check Graduation Requirements
                  </Button>
                </>
                :
                <GraduationRequirementsExamination evaluation={evaluation} />
              }
            </Accordion.Body>
          </Accordion.Item>
        ))
      }
    </Accordion >
  )
}
export default Students