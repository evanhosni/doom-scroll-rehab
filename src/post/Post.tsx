import { useCallback, useEffect, useState } from "react";
import cn from "./Post.module.css";

export const Post = ({ category, topic, fun_fact }: { [key: string]: string }) => {
  const [images, setImages] = useState<string[]>([]);

  const imageSearch = useCallback(async () => {
    // Fetching Wikipedia article information
    fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${topic}&utf8=&format=json&origin=*`)
      .then((response) => response.json())
      .then((data) => {
        // Extract the first search result's title and convert to format usable in API
        const tempArray = data.query.search[0].title.split(" ");
        const urlKey = tempArray.join("_");

        // Fetching article details including images from Wikipedia
        fetch(
          `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts|images&exintro=true&explaintext=true&titles=${urlKey}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const pageID = Object.keys(data.query.pages)[0];
            const extract = data.query.pages[pageID].extract;
            const title = data.query.pages[pageID].title;
            const images = data.query.pages[pageID].images;

            console.log(title);
            console.log(extract);
            console.log(images);

            // Fetching image URLs from Wikimedia Commons for the first 5 images
            if (images && images.length > 0) {
              const filtered_images = images.filter((image: any) => image.title.includes(topic));

              const imagePromises = filtered_images.slice(0, 5).map((image: any) => {
                const imageName = image.title;
                // Fetch image URL from Wikimedia Commons
                return fetch(
                  `https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&prop=imageinfo&iiprop=url&titles=${imageName}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    const pageID = Object.keys(data.query.pages)[0];
                    return data.query.pages[pageID].imageinfo[0].url;
                  })
                  .catch((error) => {
                    console.error("Error fetching image URL:", error);
                    return null;
                  });
              });

              // Resolve all promises and handle results
              Promise.all(imagePromises).then((imageUrls) => {
                setImages(imageUrls.filter((url) => url)); // Filtering out null values
              });
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [category, topic, fun_fact]);

  useEffect(() => {
    imageSearch();
  }, [imageSearch]);

  return (
    <div className={cn.post}>
      <h2>{topic}</h2>
      <img style={{ maxHeight: 200 }} src={images[0]}></img>
      <p>{fun_fact}</p>
    </div>
  );
};
