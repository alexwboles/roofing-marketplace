const appState = {
  role: "homeowner",
  intake: {
    address: "",
    notes: "",
    photos: [],
  },
  analysis: {
    status: "idle",
    roofScore: null,
    materials: [],
    findings: [],
    summary: "",
  },
};

export function getState() {
  return appState;
}

export function setRole(role) {
  appState.role = role;
}

export function updateIntake(partial) {
  Object.assign(appState.intake, partial);
}

export function setAnalysis(partial) {
  Object.assign(appState.analysis, partial);
}
