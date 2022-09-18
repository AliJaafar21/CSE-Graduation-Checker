const TagCell = ({ tag1, tag2, tag3 }) => {
  return (
    <>
      {(tag1 === 'No Tag' && tag2 === 'No Tag' && tag3 === 'No Tag') &&
        <td>
          -
        </td>
      }
      {(tag1 === 'No Tag' && tag2 === 'No Tag' && tag3 !== 'No Tag') &&
        <td>
          {tag3}
        </td>
      }
      {(tag1 === 'No Tag' && tag2 !== 'No Tag' && tag3 === 'No Tag') &&
        <td>
          {tag2}
        </td>
      }
      {(tag1 === 'No Tag' && tag2 !== 'No Tag' && tag3 !== 'No Tag') &&
        <td>
          {tag2} - {tag3}
        </td>
      }
      {(tag1 !== 'No Tag' && tag2 === 'No Tag' && tag3 === 'No Tag') &&
        <td>
          {tag1}
        </td>
      }
      {(tag1 !== 'No Tag' && tag2 === 'No Tag' && tag3 !== 'No Tag') &&
        <td>
          {tag1} - {tag3}
        </td>
      }
      {(tag1 !== 'No Tag' && tag2 !== 'No Tag' && tag3 === 'No Tag') &&
        <td>
          {tag1} - {tag2}
        </td>
      }
      {(tag1 !== 'No Tag' && tag2 !== 'No Tag' && tag3 !== 'No Tag') &&
        <td>
          {tag1} - {tag2} - {tag3}
        </td>
      }
    </>
  )
}
export default TagCell