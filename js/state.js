const appState = {
  role: "homeowner", // "homeowner" | "roofer"
  intake: {
    address: "",
    notes: "",
    photos: [],
  },
  analysis: {
    status: "idle", // "idle" | "processing" | "complete"
    roofScore: null,
    materials: [],
    findings: [],
    summary: "",
  },
};

export function setInitialState() {
  // could hydrate from localStorage later
}

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

