import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar.jsx";
import Home from "./Home/Home.jsx";
import Projects from "./Projects/Projects.jsx";
import Footer from "./Footer/Footer.jsx";
// import TestButton from "./TestButton/TestButton.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/*" element={<Projects />} />
        <Route path="/education" element={<div>Education</div>} />
        <Route path="/skills" element={<div>Skills</div>} />
        <Route path="/experience" element={<div>Experience</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
