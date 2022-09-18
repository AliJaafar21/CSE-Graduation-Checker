import { useRef, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import NavBar from '../NavBar'
import GraduationRequirementsExamination from './GraduationRequirementsExamination'

const StudentUserPage = ({ access_csrf, logout }) => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [transcript, setTranscript] = useState(null)
  const [courses, setCourses] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [refresh, setRefresh] = useState(true)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState()
  const [showTakenCourses, setshowTakenCourses] = useState(true)
  const ref = useRef(null)

  async function uploadTranscript() {
    if (!transcript) {
      setErrorMessage('No Transcript Chosen')
      return
    }
    if (transcript.type !== "application/pdf") {
      setErrorMessage('Only PDF Files Are Allowed')
      return
    }
    if (transcript.size > 2 * 1e6) {
      setErrorMessage('File Too Large')
      return
    }
    const file = new FormData()
    file.append('file', transcript)
    setErrorMessage('')
    setTranscript(null)
    ref.current.value = null
    setLoading(true)
    try {
      const response = await fetch(`${URL}students/me/transcript-upload`, {
        headers: {
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'POST',
        body: file
      })
      const data = await response.json()
      if (response.status !== 200) {
        if (data.error) {
          setErrorMessage(data.error)
        }
        setLoading(false)
        return
      }
      setRefresh(!refresh)
      setLoading(false)
    } catch (error) { }
  }


  async function checkGraduationRequirements() {
    try {
      const response = await fetch(`${URL}students/me/graduation-requirements-examination`, {
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


  async function getTakenCourses() {
    try {
      const response = await fetch(`${URL}students/me/taken-courses`, {
        headers: {
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'GET',
      })
      const data = await response.json()
      if (response.status !== 200) {
        if (data.error) {
          setErrorMessage(data.error)
        }
        return
      }
      setCourses(data['courses'])
    } catch (error) { }
  }

  useEffect(() => {
    getTakenCourses()
  }, [refresh])

  return (
    <div className='bg-dark text-white height-100'>
      <NavBar logout={logout} />
      <br />
      {
        showTakenCourses ?
          <>
            <div className='d-flex justify-content-center'>
              <Card className='w-75'>
                {errorMessage !== '' &&
                  <Alert variant='danger' className="text-center">
                    {errorMessage}
                  </Alert>
                }
                <Card.Body>
                  <div className='my-container my-flex-direction'>
                    <Form.Control type="file" accept='application/pdf' className='file-input margin-5-px' onChange={(e) => (setTranscript(e.target.files[0]))} ref={ref} />
                    {loading &&
                      <Spinner animation="border" className='margin-5-px' variant="dark" as={'div'} />
                    }
                    <Button as='div' variant='outline-primary' className='upload-btn margin-5-px' onClick={uploadTranscript}>
                      Upload Transcript
                    </Button>
                    <Button as='div' variant='outline-success' className='check-requirements-btn margin-5-px' onClick={checkGraduationRequirements}>
                      Check Graduation Requirements
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <br />
            <div className='bg-dark text-center'>
              <h5>Taken Courses: {courses.length}</h5>
              <div className='d-flex flex-wrap taken-courses-margins'>
                {
                  courses.map((course) => (
                    <h3 key={course} className='taken-courses-margins'><Badge bg="primary" >{course}</Badge></h3>
                  ))
                }
              </div>
            </div>
          </>
          :
          <GraduationRequirementsExamination evaluation={evaluation} />
      }

    </div >
  )
}
export default StudentUserPage