/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import MainContent from "./MainContent/MainContent.jsx";
import Home from "./pages/Home/Home.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import Experience from "./pages/Experience/Experience.jsx";
import Education from "./pages/Education/Education.jsx";
import Footer from "./components/Footer/Footer.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Ressiveness
  // const [width, setWidth] = useState(window.innerWidth);
  // function handleWindowSizeChange() {
  //   setWidth(window.innerWidth);
  // }
  // useEffect(() => {
  //   window.addEventListener("resize", handleWindowSizeChange);
  //   return () => {
  //     window.removeEventListener("resize", handleWindowSizeChange);
  //   };
  // }, []);
  // const deviceType = width <= 768 ? "mobile" : "desktop";

  const [projects, setProjects] = useState({});
  const [featuredProjects, setFeaturedProjects] = useState({});
  const [experiences, setExperiences] = useState({});
  const [tech, setTech] = useState([]);

  useEffect(() => {
    const fetchProjectData = async (folder) => {
      const FILE_NAMES = {
        info: "info.json",
        readme: "README.md",
      };

      let projectData = {};

      // Basic info
      try {
        const response = await fetch(`/data/projects/${folder}/${FILE_NAMES.info}`);
        projectData = await response.json();
        projectData.private = Boolean(projectData.private);
      } catch (error) {
        console.error(`Error fetching info.json for ${folder}: ${error}`);
        return null;
      }

      // Readme
      try {
        if (!projectData.private) {
          const readmeRes = await fetch(`/data/projects/${folder}/${FILE_NAMES.readme}`);
          projectData.readme = await readmeRes.text();
        } else projectData.readme = null;
      } catch (error) {
        projectData.readme = null;
      }
      return projectData;
    };

    const fetchExperienceData = async (folder) => {
      try {
        const response = await fetch(`/data/experience/${folder}/info.json`);
        return await response.json();
      } catch (error) {
        console.error(`Error fetching info.json for ${folder}: ${error}`);
        return null;
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("/data/projects/index.json");
        if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
        const projectFolders = await res.json(); // array of folder names

        let projectsData = {};
        for (const folder of projectFolders) {
          projectsData[folder] = await fetchProjectData(folder);
        }

        setProjects(projectsData);
        const featured = Object.fromEntries(Object.entries(projectsData).filter(([, project]) => project.featured));
        setFeaturedProjects(featured);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchExperiences = async () => {
      try {
        const res = await fetch("/data/experience/index.json");
        if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
        const expFolders = await res.json();

        let expsData = {};
        for (const folder of expFolders) {
          expsData[folder] = await fetchExperienceData(folder);
        }
        setExperiences(expsData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    const fetchTech = async () => {
      try {
        const res = await fetch("/data/tech/index.json");
        if (!res.ok) throw new Error(`Failed to fetch tech/index.json: ${res.status}`);
        const techData = await res.json();
        setTech(techData);
      } catch (error) {
        console.error("Error fetching tech:", error);
      }
    };

    fetchProjects();
    fetchExperiences();
    fetchTech();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home featuredProjectsData={featuredProjects} experiencesData={experiences} projectsData={projects} techData={tech} />} />
          <Route path="/projects/*" element={<Projects projectsData={projects} />} />
          <Route path="/experience/*" element={<Experience experiencesData={experiences} projectsData={projects} />} />
          <Route path="/education" element={<Education />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </MainContent>
      <Footer />
    </>
  );
}

export default App;
