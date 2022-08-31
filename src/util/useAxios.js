import { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let clientLeft = false;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);

        if (clientLeft) return;

        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        console.log(error);
      }
    };

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, [url]);
  return { isLoading, isError, data };
};
export default useAxios;
