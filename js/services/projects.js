// js/services/projects.js
import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where
} from '../firebase.js';

export async function createProject(data) {
  const user = auth.currentUser;
  const email = user?.email || data.email;

  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    email,
    status: 'open',
    createdAt: Date.now()
  });

  return ref.id;
}

export async function getProjectWithQuotes() {
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(collection(db, 'projects'), where('email', '==', user.email));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const docRef = snap.docs[0];
  const project = { id: docRef.id, ...docRef.data() };

  const quotesSnap = await getDocs(collection(db, 'projects', docRef.id, 'quotes'));
  const quotes = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const healthDoc = await getDoc(doc(db, 'roofHealthChecks', docRef.id));
  const roofHealth = healthDoc.exists() ? healthDoc.data() : null;

  return { project, quotes, roofHealth };
}

export async function getRooferProjects() {
  const snap = await getDocs(collection(db, 'projects'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function submitBid(projectId, bid) {
  await addDoc(collection(db, 'projects', projectId, 'quotes'), {
    ...bid,
    createdAt: Date.now()
  });
}
