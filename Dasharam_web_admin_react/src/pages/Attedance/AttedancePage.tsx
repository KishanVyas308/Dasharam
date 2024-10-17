import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { teastsAtom } from "../../state/testsAtom";
import { getAllTests } from "../../backend/handleTest";
import AddAttedance from "./AddAttedance";


const AttedancePage = () => {
  const [tests, setTests] = useRecoilState(teastsAtom);

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
    <AddAttedance />
  </div>;
};

export default AttedancePage;
