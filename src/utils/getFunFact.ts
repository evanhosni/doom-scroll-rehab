import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getFunFact = async (previouslyUsed: string[]) => {
  const getData = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to output JSON. The JSON object should be in the form of { category: string; topic: string; fun_fact: string; }",
      },
      {
        role: "user",
        content: `Please choose a category out of the following options: animals, art, artists. Then give me a random topic that belongs to that category (the topic should belong to the selected category, but it should be obscure and completely random. It should not be included in this list of previously used topics: ${previouslyUsed.join(
          ", "
        )}). Then give me a fun fact about that topic. Please return all of this information in the aforementioned JSON format.`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });

  const data: any = JSON.parse(getData.choices[0].message.content as string);

  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${data.topic}&utf8=&format=json&origin=*`)
    .then((response) => response.json())
    .then((wikiData) => console.log(wikiData));

  return data;
};
