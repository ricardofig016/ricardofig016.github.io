/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar.jsx";
import MainContent from "./MainContent/MainContent.jsx";
import Home from "./Home/Home.jsx";
import Projects from "./Projects/Projects.jsx";
import Education from "./Education/Education.jsx";
import Footer from "./Footer/Footer.jsx";

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

  useEffect(() => {
    const fetchRepoData = async (folder) => {
      const FILE_NAMES = {
        info: "info.json",
        readme: "README.md",
      };

      let repoData = {};

      // Basic info
      try {
        const response = await fetch(`/data/repos/${folder}/${FILE_NAMES.info}`);
        repoData = await response.json();
      } catch (error) {
        console.error(`Error fetching info.json for ${folder}: ${error}`);
        return null;
      }

      // Readme
      try {
        const readmeRes = await fetch(`/data/repos/${folder}/${FILE_NAMES.readme}`);
        repoData.readme = await readmeRes.text();
      } catch (error) {
        repoData.readme = null;
      }
      return repoData;
    };

    const fetchRepos = async () => {
      try {
        const res = await fetch("/data/repos/index.json");
        if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
        const repoFolders = await res.json(); // array of folder names

        let reposData = {};
        for (const folder of repoFolders) {
          reposData[folder] = await fetchRepoData(folder);
        }

        setProjects(reposData);
        const featured = Object.fromEntries(Object.entries(reposData).filter(([, repo]) => repo.featured));
        setFeaturedProjects(featured);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchRepos();
  }, []);

  return (
    <>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home featuredProjectsData={featuredProjects} />} />
          <Route path="/projects/*" element={<Projects projectsData={projects} />} />
          <Route path="/education" element={<Education />} />
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
