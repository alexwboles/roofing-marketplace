const state = {
  role: "homeowner", // or "roofer"
  intake: {
    address: "",
    roofAge: "",
    squareFootage: "",
    pitch: "",
    valleys: "",
    layers: "",
    material: "",
    notes: ""
  },
  analysis: null,    // AI roof report
  projects: [],      // list of projects
  currentProject: null, // active project
  quotes: []         // homeowner quote list
};

export function getState() {
  return state;
}

export function setRole(role) {
  state.role = role;
}

export function setIntakeField(field, value) {
  state.intake[field] = value;
}

export function setAnalysis(report) {
  state.analysis = report;
}

export function setProjects(projects) {
  state.projects = projects;
}

export function setCurrentProject(project) {
  state.currentProject = project;
}

export function setQuotes(quotes) {
  state.quotes = quotes;
}
