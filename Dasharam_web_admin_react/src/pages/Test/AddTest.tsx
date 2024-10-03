import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { testsState } from '../../state/testsAtom'

const AddTest = () => {
    const test = useRecoilValue(testsState);

    const [name, setName] = useState("");
    const [standardId, setStandardId] =useState("");
    const [subject, setSubject] = useState("");
    const [takenByTeacherId, setTakenByTeacherId] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [takenDate, setTakenDate] = useState("");
  

  return (
    <div>
      
    </div>
  )
}

export default AddTest
