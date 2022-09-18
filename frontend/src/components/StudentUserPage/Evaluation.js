import Badge from 'react-bootstrap/Badge'
import './StudentUserPage.css'

const Evaluation = ({ category, data }) => {
  return (
    <div key={category} className="evaluation-margins">
      <h4>{category} ({data["ratio"]})</h4>
      <div className='blue-line'></div>
      <br />
      <div className='d-flex flex-wrap'>
        {
          Object.entries(data).map(([key, value]) => {
            if (key !== "ratio")
              return <h4 key={key} className='badge-container-margins'>
                <Badge bg={value === "TAKEN" ? "success" : (value === "NOT_TAKEN" ? "danger" : "warning")}>{key}</Badge>
              </h4>
          })
        }
      </div>
      <br />
    </div >
  )
}
export default Evaluation