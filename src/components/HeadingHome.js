import { useEffect, useState } from "react";
import { API_URL_HEADING } from "../contance";
import useFetch from "../utils/useFetch";
import HeadingForm from "./HeadingForm";
import HeadingResult from "./HeadingResult";

const HeadingHome = () => {
  const [result, setResult] = useState([]);
  const {data} = useFetch(API_URL_HEADING, 'GET');
  useEffect(() => {
    setResult(data);
  },[data]);
  return (
    <div>
      <h1 className='text-center my-5'>予定伝票一覧</h1>
      <HeadingForm data={result} setData={setResult}/>
      <HeadingResult data={result}/>
    </div>
  )
}

export default HeadingHome