import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { testsState } from "../../state/testsAtom";
import { getAllTests } from "../../backend/handleTest";
import AddTest from "./AddTest";
import ManageTest from "./ManageTest";

const TestPage = () => {
  const [tests, setTests] = useRecoilState(testsState);

  useEffect(() => {
    async function fatchTest() {
      if (tests.length === 0) {
        const result = await getAllTests();
        setTests(result);
      }
    }
    fatchTest();
  }, []);
  return <div className="">
    <AddTest />
    <ManageTest />
  </div>;
};

export default TestPage;
