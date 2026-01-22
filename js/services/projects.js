// js/services/projects.js
import { db } from '../firebase.js';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export async function upsertHomeownerUser({ name, email, phone }) {
  const userRef = doc(collection(db, 'users'), email);
  await setDoc(
    userRef,
    {
      name,
      email,
      phone,
      role: 'homeowner',
      updatedAt: Date.now(),
    },
    { merge: true }
  );
  return { id: email };
}

export async function createProject(data) {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: Date.now(),
    status: 'intake_complete',
  });
  return ref.id;
}

export async function getProject(projectId) {
  const snap = await getDoc(doc(db, 'projects', projectId));
  return { id: projectId, ...snap.data() };
}

export async function getLastProjectForUser(email) {
  const q = query(
    collection(db, 'projects'),
    where('homeownerId', '==', email),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getQuotesForProject(projectId) {
  const q = query(collection(db, 'quotes'), where('projectId', '==', projectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRoofHealthForProject(projectId) {
  const snap = await getDoc(doc(db, 'roofHealthChecks', projectId));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function getOpenProjectsForRoofer() {
  const q = query(
    collection(db, 'projects'),
    where('status', '==', 'intake_complete')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getQuotesForRoofer(rooferId) {
  const q = query(collection(db, 'quotes'), where('rooferId', '==', rooferId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createQuote(data) {
  await addDoc(collection(db, 'quotes'), {
    ...data,
    createdAt: Date.now(),
    status: 'submitted',
  });
}

export async function acceptQuote(quoteId) {
  const quoteRef = doc(db, 'quotes', quoteId);
  await setDoc(
    quoteRef,
    {
      status: 'accepted',
      acceptedAt: Date.now(),
    },
    { merge: true }
  );
}
