import Evaluation from './Evaluation'

const GraduationRequirementsExamination = ({ evaluation }) => {
  return (
    <div className='bg-dark'>
      <Evaluation category="CSE Core Courses" data={evaluation.coreCourses} />
      <Evaluation category="CSE Technical Electives" data={evaluation.technicalElectives} />
      <Evaluation category="CSE Concentration Area Electives" data={evaluation.concentrationAreaElectives} />
      <Evaluation category="CSE Lab Requirements" data={evaluation.labRequirements} />
      <Evaluation category="CSE Lab Electives" data={evaluation.labElectives} />
      <Evaluation category="Final Year Project" data={evaluation.fyp} />
      <Evaluation category="Approved Experience" data={evaluation.approvedExperience} />
      <Evaluation category="INDE Courses" data={evaluation.indeCourses} />
      <Evaluation category="Math Requirements" data={evaluation.mathRequirements} />
      <Evaluation category="Math Electives" data={evaluation.mathElectives} />
      <Evaluation category="Science Requirements" data={evaluation.scienceRequirements} />
      <Evaluation category="Science Electives" data={evaluation.scienceElectives} />
      <Evaluation category="Natural Sciences" data={evaluation.naturalSciences} />
      <Evaluation category="Arabic Communication Skills" data={evaluation.arabicCommunicationSkills} />
      <Evaluation category="English Communication Skills" data={evaluation.englishCommunicationSkills} />
      <Evaluation category="Humanities I" data={evaluation.humanities1} />
      <Evaluation category="Humanities II" data={evaluation.humanities2} />
      <Evaluation category="Social Sciences I" data={evaluation.socialSciences1} />
      <Evaluation category="Social Sciences II" data={evaluation.socialSciences2} />
      <Evaluation category="Not Considered" data={evaluation.notConsidered} />
    </div>
  )
}
export default GraduationRequirementsExamination