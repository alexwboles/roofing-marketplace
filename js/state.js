const state = {
  role: "homeowner",
  intake: {
    address: "",
  },
  analysis: null,
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
