/* ============================================================
   projects.js — UPDATED TO LOAD PROJECT BY localStorage
   ============================================================ */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "../app.js";

// ------------------------------------------------------------
// Create a new project
// ------------------------------------------------------------

export async function createProject(data) {
  const docRef = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: Date.now()
  });

  return docRef.id;
}

// ------------------------------------------------------------
// Load project + quotes + roof health using session projectId
// ------------------------------------------------------------

export async function getProjectWithQuotes() {
  const projectId = localStorage.getItem("activeProjectId");
  if (!projectId) return null;

  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) return null;

  const project = { id: projectId, ...projectSnap.data() };

  // Quotes
  const quotesSnap = await getDocs(collection(db, "projects", projectId, "quotes"));
  const quotes = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Roof health
  const healthRef = doc(db, "roofHealthChecks", projectId);
  const healthSnap = await getDoc(healthRef);
  const roofHealth = healthSnap.exists() ? healthSnap.data() : null;

  return { project, quotes, roofHealth };
}

// ------------------------------------------------------------
// Roofer: load all open projects
// ------------------------------------------------------------

export async function getRooferProjects() {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ------------------------------------------------------------
// Roofer: submit bid
// ------------------------------------------------------------

export async function submitBid(projectId, bid) {
  await addDoc(collection(db, "projects", projectId, "quotes"), {
    ...bid,
    createdAt: Date.now()
  });
}

