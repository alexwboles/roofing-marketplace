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
    notes: "",
    photosCount: 0
  },
  analysis: null,
  projects: []
};

export function getState() {
  return state;
}

export function setRole(role) {
  state.role = role;
}

export function updateIntake(partial) {
  state.intake = { ...state.intake, ...partial };
}

export function setAnalysis(analysis) {
  state.analysis = analysis;
}

export function setProjects(projects) {
  state.projects = projects;
}
