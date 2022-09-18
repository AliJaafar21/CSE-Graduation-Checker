import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import TagFormEntry from './TagFormEntry'

const CourseCreationAndEditingModal = ({
  show, handleClose,
  type,
  access_csrf,
  refresh, setRefresh,
  names,
  name, setName,
  title, setTitle,
  tag1, setTag1,
  tag2, setTag2,
  tag3, setTag3,
  equivalentCourse, setEquivalentCourse }) => {

  const URL = "https://csegraduationchecker.pythonanywhere.com/api/"

  const [errorMessage, setErrorMessage] = useState('')

  const tagDisplayValueToServerValue = {
    'CSE Core': 'CSE_CORE',
    'CSE Concentration Area Elective': 'CSE_CONC_AREA_ELEC',
    'CSE Technical Elective': 'CSE_TECH_ELEC',
    'CSE Laboratory Requirement': 'CSE_LAB_REQ',
    'CSE Laboratory Elective': 'CSE_LAB_ELEC',
    'CSE INDE Requirement': 'CSE_INDE_REQ',
    'Approved Experience': 'APP_EXP',
    'Final Year Project': 'FYP',
    'Math Requirement': 'MATH_REQ',
    'Math Elective': 'MATH_ELEC',
    'Science Requirement': 'SCI_REQ',
    'Science Elective': 'SCI_ELEC',
    'Natural Sciences': 'NS',
    'Arabic Communication Skills': 'AR',
    'English Communication Skills': 'EN',
    'Humanities I': 'HUM1',
    'Humanities II': 'HUM2',
    'Social Sciences I': 'SS1',
    'Social Sciences II': 'SS2',
    'No Tag': 'NO_TAG'
  }

  async function createCourse() {
    try {
      const response = await fetch(`${URL}courses/course-creation`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({
          name: name,
          title: title,
          tag1: tagDisplayValueToServerValue[tag1],
          tag2: tagDisplayValueToServerValue[tag2],
          tag3: tagDisplayValueToServerValue[tag3],
          equivalent_to: (equivalentCourse === 'None' ? null : equivalentCourse)
        })
      })
      const data = await response.json()
      if (response.status === 201) {
        handleClose()
        setRefresh(!refresh)
      }
      else if (data.error) {
        setErrorMessage(data.error)
      }
    } catch (error) { }
  }


  async function updateCourse() {
    try {
      const response = await fetch(`${URL}courses/course-update`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': access_csrf
        },
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify({
          name: name,
          title: title,
          tag1: tagDisplayValueToServerValue[tag1],
          tag2: tagDisplayValueToServerValue[tag2],
          tag3: tagDisplayValueToServerValue[tag3],
          equivalent_to: (equivalentCourse === 'None' ? null : equivalentCourse)
        })
      })
      const data = await response.json()
      if (response.status !== 200) {
        setErrorMessage(data.error)
      }
      if (response.status === 200) {
        handleClose()
        setRefresh(!refresh)
      }
    } catch (error) { }
  }


  async function deleteCourse() {
    try {
      const response = await fetch(`${URL}courses/course-deletion`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': access_csrf,
        },
        credentials: 'include',
        method: 'DELETE',
        body: JSON.stringify({
          name: name,
        })
      })
      const data = await response.json()
      if (response.status !== 200) {
        setErrorMessage(data.error)
      }
      if (response.status === 200) {
        handleClose()
        setRefresh(!refresh)
      }
    } catch (error) { }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      {errorMessage !== '' &&
        <Alert variant='danger' className="text-center">
          {errorMessage}

        </Alert>
      }
      <Modal.Body>
        <Form className="dark">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => (setName(e.target.value.replaceAll(' ', '').toUpperCase()))} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => (setTitle(e.target.value))} />
          </Form.Group>
          <TagFormEntry num={1} defaultValue={tag1} setTag={setTag1} />
          <TagFormEntry num={2} defaultValue={tag2} setTag={setTag2} />
          <TagFormEntry num={3} defaultValue={tag3} setTag={setTag3} />
          <Form.Group className="mb-3">
            <Form.Label>Equivalent Course</Form.Label>
            <Form.Select defaultValue={equivalentCourse ? equivalentCourse : 'None'} onChange={(e) => (setEquivalentCourse(e.target.value))}>
              {
                names.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))
              }
              <option value='None'>None</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      {type ?
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => { handleClose(); setErrorMessage('') }}>
            Cancel
          </Button>
          <Button variant="outline-success" onClick={() => { setErrorMessage(''); createCourse() }}>
            Create Course
          </Button>
        </Modal.Footer>
        :
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => { handleClose(); setErrorMessage('') }}>
            Exit Without Saving
          </Button>
          <Button variant="outline-danger" onClick={() => { setErrorMessage(''); deleteCourse() }}>
            Delete This Course
          </Button>
          <Button variant="outline-success" onClick={() => { setErrorMessage(''); updateCourse() }}>
            Save Changes
          </Button>
        </Modal.Footer>
      }
    </Modal >
  )
}
export default CourseCreationAndEditingModal