const state = {
  role: "homeowner",
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
  analysis: null,
  projects: [],
  currentProject: null,
  quotes: []
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
