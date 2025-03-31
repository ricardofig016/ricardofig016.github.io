import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar.jsx";
import MainContent from "./MainContent/MainContent.jsx";
import Home from "./Home/Home.jsx";
import Projects from "./Projects/Projects.jsx";
import Footer from "./Footer/Footer.jsx";
// import TestButton from "./TestButton/TestButton.jsx";

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const deviceType = width <= 768 ? "mobile" : "desktop";

  return (
    <>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home deviceType={deviceType} />} />
          <Route path="/projects/*" element={<Projects />} />
          <Route path="/education" element={<div>Education</div>} />
          <Route path="/skills" element={<div>Skills</div>} />
          <Route path="/experience" element={<div>Experience</div>} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </MainContent>
      <Footer />
    </>
  );
}

export default App;
