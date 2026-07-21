import "@/App.css";
import { ReactLenis } from "lenis/react";
import Landing from "@/pages/Landing";

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.09, duration: 1.2, smoothWheel: true, anchors: true }}>
      <div className="App grain">
        <Landing />
      </div>
    </ReactLenis>
  );
}

export default App;
