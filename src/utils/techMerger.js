/**
 * Merges technologies from multiple projects in a deterministic order.
 * Uses a round-robin approach that preserves the relevance order from each project.
 *
 * Algorithm:
 * - Iterate through indices (0, 1, 2, ...)
 * - At each index, collect techs from all projects that have a tech at that index
 * - Add them in project order (first project in the list has priority)
 * - Skip duplicates (each tech appears only once)
 *
 * Example:
 * p1: [t1, t2, t3, t4, t5, t6]
 * p2: [t7, t8, t9, t2, t3, t10]
 * Result: [t1, t7, t2, t8, t3, t9, t4, t5, t6, t10]
 *
 * @param {Array<Array<string>>} projectTechArrays - Array of technology arrays from projects
 * @returns {Array<string>} - Merged array of unique technologies in relevance order
 */
export function mergeTechnologies(projectTechArrays) {
  if (!projectTechArrays || projectTechArrays.length === 0) {
    return [];
  }

  const result = [];
  const seen = new Set();

  // Find the maximum length among all arrays
  const maxLength = Math.max(...projectTechArrays.map((arr) => arr?.length || 0));

  // Round-robin through indices
  for (let index = 0; index < maxLength; index++) {
    // For each project in order
    for (const techArray of projectTechArrays) {
      if (techArray && index < techArray.length) {
        const tech = techArray[index];
        // Add if not already seen
        if (tech && !seen.has(tech)) {
          result.push(tech);
          seen.add(tech);
        }
      }
    }
  }

  return result;
}

/**
 * Gets technologies for an experience by merging its related projects' technologies.
 *
 * @param {Object} experience - Experience object with projects array
 * @param {Object} projectsData - Object mapping project codes to project data
 * @returns {Array<string>} - Array of merged technologies
 */
export function getExperienceTechnologies(experience, projectsData) {
  if (!experience || !experience.projects || experience.projects.length === 0) {
    return [];
  }

  // Get technology arrays from each project
  const projectTechArrays = experience.projects
    .map((projectCode) => {
      const project = projectsData[projectCode];
      return project?.technologies || [];
    })
    .filter((arr) => arr.length > 0); // Remove empty arrays

  return mergeTechnologies(projectTechArrays);
}
