import { collection, getDocs } from 'firebase/firestore';
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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed.' });
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    let totalRsvps = 0;
    let totalAttending = 0;
    let totalDeclined = 0;

    snap.forEach((d) => {
      const data = d.data();
      totalRsvps++;
      if (data.willAttend === 'yes') totalAttending++;
      if (data.willAttend === 'no') totalDeclined++;
    });

    return res.status(200).json({ success: true, totalRsvps, totalAttending, totalDeclined });
  } catch (err: any) {
    console.error('Admin stats error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Failed to calculate stats.' });
  }
}
