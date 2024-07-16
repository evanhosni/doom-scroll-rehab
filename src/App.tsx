import "./App.css";
import { NewsfeedContextProvider } from "./context/NewsfeedContext";
import { Newsfeed } from "./newsfeed/Newsfeed";

function App() {
  return (
    <NewsfeedContextProvider>
      <Newsfeed />
    </NewsfeedContextProvider>
  );
}

export default App;
