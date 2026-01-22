import { db } from '../firebase.js';
import {
  collection, doc, setDoc, addDoc, getDoc, getDocs, query, where
} from 'firebase/firestore';

export async function upsertHomeownerUser({ name, email, phone }) {
  const userRef = doc(collection(db, 'users'), email);
  await setDoc(userRef, {
    name,
    email,
    phone,
    role: 'homeowner',
    updatedAt: Date.now(),
  }, { merge: true });

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
  return snap.data();
}

export async function getQuotesForProject(projectId) {
  const q = query(collection(db, 'quotes'), where('projectId', '==', projectId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createQuote(data) {
  await addDoc(collection(db, 'quotes'), {
    ...data,
    createdAt: Date.now(),
    status: 'submitted',
  });
}
