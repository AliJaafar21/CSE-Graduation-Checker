import Form from 'react-bootstrap/Form';

const TagFormEntry = ({ num, defaultValue, setTag }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Tag {num}</Form.Label>
      <Form.Select defaultValue={defaultValue} onChange={(e) => (setTag(e.target.value))}>
        <option value='CSE Core'>CSE Core</option>
        <option value='CSE Concentration Area Elective'>CSE Concentration Area Elective</option>
        <option value='CSE Technical Elective'>CSE Technical Elective</option>
        <option value='CSE Laboratory Requirement'>CSE Laboratory Requirement</option>
        <option value='CSE Laboratory Elective'>CSE Laboratory Elective</option>
        <option value='CSE INDE Requirement'>CSE INDE Requirement</option>
        <option value='Approved Experience'>Approved Experience</option>
        <option value='Final Year Project'>Final Year Project</option>
        <option value='Math Requirement'>Math Requirement</option>
        <option value='Math Elective'>Math Elective</option>
        <option value='Science Requirement'>Science Requirement</option>
        <option value='Science Elective'>Science Elective</option>
        <option value="Natural Sciences">Natural Sciences</option>
        <option value="Arabic Communication Skills">Arabic Communication Skills</option>
        <option value="English Communication Skills">English Communication Skills</option>
        <option value="Humanities I">Humanities I</option>
        <option value="Humanities II">Humanities II</option>
        <option value="Social Sciences I">Social Sciences I</option>
        <option value="Social Sciences II">Social Sciences II</option>
        <option value='No Tag'>No Tag</option>
      </Form.Select>
    </Form.Group>
  )
}
export default TagFormEntry