import { useEffect, useState } from "react"
import axios from "axios"


export default function useFetch(url, type){

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async function(){
      try{
          setLoading(true);
          const response = await axios({
            method: type,
            headers: { 
              Pragma: 'no-cache',
              'Content-Type': 'application/json; charset=utf-8',
              'Authorization': 'Bearer ndq'
            },
            url,
          });
          setData(response.data);
        }catch(err){
          setError(err);
        }finally{
        setLoading(false);
      }
    }
    fetchData();
  }, [url, type])

  return { data, error, loading }

}