import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "urql";

let usePreviousValue = (track) => {
  let ref = React.useRef(track);
  React.useEffect(() => {
    ref.current = track;
  });
  return ref.current;
};

let usePagination = ({ query, indexKey, totalKey, variables }) => {
  let { limit, offset: initialOffset } = variables;

  let [offset, setOffset] = useState(initialOffset);

  let [result] = useQuery({
    query,
    variables: { ...variables, limit, offset },
  });

  // should be here to immediately pick up the first (cached) result
  let [index, setIndex] = useState(result.data ? result.data[indexKey] : []);
  let [total, setTotal] = useState(result.data ? result.data[totalKey] : null);

  let prevFetching = usePreviousValue(result.fetching);

  useEffect(() => {
    if (prevFetching == true && result.fetching == false && !result.error) {
      setIndex((prevIndex) => [...prevIndex, ...result.data[indexKey]]);
      setTotal(result.data[totalKey]);
    }
  }, [prevFetching, result.fetching, result.error, result.data]);

  let fetchMore = React.useCallback(() => {
    setOffset((prevOffset) => prevOffset + limit);
  }, [limit]);

  return [
    {
      data: { [indexKey]: index, [totalKey]: total },
      fetching: result.fetching,
      error: result.error,
    },
    fetchMore,
  ];
};

export default usePagination;
