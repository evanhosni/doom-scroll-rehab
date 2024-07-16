import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "../post/Post";
import { getFunFact } from "../utils/getFunFact";

interface PostType {
  category: string;
  topic: string;
  fun_fact: string;
}

export const Newsfeed = () => {
  const [items, setItems] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [previouslyUsed, setPreviouslyUsed] = useState<string[]>([]);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    setLoading(true);
    const data = await getFunFact(previouslyUsed);

    setPreviouslyUsed((prev) => [...prev, data.topic]);
    setItems((prev) => [...prev, data]);

    setCount((prev) => prev + 1);

    if (count > 10) {
      setHasMore(false);
    }

    setLoading(false);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Post category={item.category} topic={item.topic} fun_fact={item.fun_fact} />
          </React.Fragment>
        ))}
      </InfiniteScroll>
      {loading && <h4>Loading more...</h4>}
    </div>
  );
};
