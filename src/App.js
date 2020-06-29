import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

const ApiActionType = {
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case ApiActionType.FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ApiActionType.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case ApiActionType.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      return state;
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ApiActionType.FETCH_INIT });
      try {
        const result = await axios(url);
        dispatch({ type: ApiActionType.FETCH_SUCCESS, payload: result.data });
      } catch (error) {
        dispatch({ type: ApiActionType.FETCH_FAILURE });
      }
    };
    fetchData();
  }, [url]);

  return [state, setUrl];
};

function App() {
  const [query, setQuery] = useState("redux");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=redux",
    {
      hits: [],
    }
  );

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>
      {isError && <div>Something went wrong ...</div>}
      <ul>
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <ul>
            {data.hits.map((item) => (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </>
  );
}

export default App;
