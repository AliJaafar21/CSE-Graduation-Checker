import Pagination from 'react-bootstrap/Pagination'

const CoursesPagination = ({ nPages, setCurrentPage }) => {

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
  return (
    <div className='bg-dark w-100 margin-20-px' >
      <Pagination className='d-flex flex-wrap justify-content-center margin-0'>
        {
          pageNumbers.map((pageNumber) => (
            <Pagination.Item className='bg-dark margin-5-px' key={pageNumber} onClick={() => (setCurrentPage(pageNumber))} as={'div'}>
              {pageNumber}
            </Pagination.Item>
          ))
        }
      </Pagination>
    </div>
  )
}
export default CoursesPagination