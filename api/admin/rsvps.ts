import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, COLLECTION_NAME } from '../_firebase';
import { verifyAdminToken } from '../_auth';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !verifyAdminToken(token)) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired admin session.' });
  }

  // GET /api/admin/rsvps
  if (req.method === 'GET') {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const rsvps: any[] = [];
      querySnapshot.forEach((d) => {
        rsvps.push(d.data());
      });
      return res.status(200).json({ success: true, rsvps });
    } catch (err: any) {
      console.error('Admin fetch error:', err?.message || err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve RSVPs from Firestore.' });
    }
  }

  // PATCH /api/admin/rsvps (or with ?id=...)
  if (req.method === 'PATCH') {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid JSON payload.' });
        }
      }

      const { willAttend, adultsCount, childrenCount } = body || {};

      const docRef = doc(db, COLLECTION_NAME, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        return res.status(404).json({ success: false, error: 'RSVP record not found.' });
      }

      const updates: Record<string, any> = {};
      if (willAttend === 'yes' || willAttend === 'no') updates.willAttend = willAttend;
      if (typeof adultsCount === 'number') updates.adultsCount = adultsCount;
      if (typeof childrenCount === 'number') updates.childrenCount = childrenCount;

      await updateDoc(docRef, updates);
      const updatedDoc = await getDoc(docRef);

      return res.status(200).json({ success: true, rsvp: updatedDoc.data() });
    } catch (err: any) {
      console.error('Admin update error:', err?.message || err);
      return res.status(500).json({ success: false, error: 'Failed to update RSVP in Firestore.' });
    }
  }

  // DELETE /api/admin/rsvps?id=...
  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'RSVP ID is required.' });
      }
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('Admin delete error:', err?.message || err);
      return res.status(500).json({ success: false, error: 'Failed to delete RSVP from Firestore.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed.' });
}
