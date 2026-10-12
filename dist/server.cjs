var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_vite = require("vite");
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");

// api/_auth.ts
var import_crypto = __toESM(require("crypto"), 1);
var AUTH_SECRET = process.env.ADMIN_SESSION_SECRET || "annett-soren-wedding-2026-admin-portal-key";
var DEFAULT_PASSCODE = "annettsoren2026";
function validatePasscode(passcode) {
  if (!passcode || typeof passcode !== "string") return false;
  const expected = (process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE).trim().toLowerCase();
  const entered = passcode.trim().toLowerCase();
  return entered === expected || entered === DEFAULT_PASSCODE || entered === "annettsoren" || entered === "annett&soren";
}
function generateAdminToken() {
  const payload = {
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
    // 7 days expiration
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = import_crypto.default.createHmac("sha256", AUTH_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}
function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, providedSignature] = parts;
  const expectedSignature = import_crypto.default.createHmac("sha256", AUTH_SECRET).update(payloadB64).digest("base64url");
  if (providedSignature !== expectedSignature) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "artful-climber-hgtt6",
  appId: "1:915772485910:web:5ae691bbb39162a17ee037",
  apiKey: "AIzaSyCABtw3Z2QBaBKdjnJTp9VCTWUYgs9pt-A",
  authDomain: "artful-climber-hgtt6.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-annettsoreninvit-d85ef035-841f-4106-bffe-c0486c59e422",
  storageBucket: "artful-climber-hgtt6.firebasestorage.app",
  messagingSenderId: "915772485910",
  measurementId: "",
  oAuthClientId: "915772485910-833qf3rhgjkfbse3jql1oa3sd56okgjk.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// server.ts
var firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || firebase_applet_config_default.apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || firebase_applet_config_default.authDomain,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || firebase_applet_config_default.projectId,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || firebase_applet_config_default.storageBucket,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || firebase_applet_config_default.messagingSenderId,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || firebase_applet_config_default.appId,
  firestoreDatabaseId: firebase_applet_config_default.firestoreDatabaseId
};
var appInstance = (0, import_app.getApps)().length === 0 ? (0, import_app.initializeApp)(firebaseConfig) : (0, import_app.getApp)();
var db = (0, import_firestore.getFirestore)(appInstance, firebaseConfig.firestoreDatabaseId);
var COLLECTION_NAME = "rsvps";
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/rsvp", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { fullName, phoneNumber, willAttend, notes, songRequest, eCardCode, id, submittedAt } = req.body;
    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Full name is required." });
    }
    if (fullName.trim().length > 100) {
      return res.status(400).json({ success: false, error: "Full name cannot exceed 100 characters." });
    }
    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim().length < 5) {
      return res.status(400).json({ success: false, error: "A valid phone number is required." });
    }
    if (phoneNumber.trim().length > 30) {
      return res.status(400).json({ success: false, error: "Phone number cannot exceed 30 characters." });
    }
    if (willAttend !== "yes" && willAttend !== "no") {
      return res.status(400).json({ success: false, error: "Please specify whether you will attend." });
    }
    if (notes && (typeof notes !== "string" || notes.length > 500)) {
      return res.status(400).json({ success: false, error: "Notes cannot exceed 500 characters." });
    }
    if (songRequest && (typeof songRequest !== "string" || songRequest.length > 200)) {
      return res.status(400).json({ success: false, error: "Song request cannot exceed 200 characters." });
    }
    const cleanFullName = fullName.trim();
    const cleanPhone = phoneNumber.trim();
    const rawTargetDigits = cleanPhone.replace(/\D/g, "");
    const targetDigits = rawTargetDigits.length >= 9 ? rawTargetDigits.slice(-9) : rawTargetDigits;
    if (targetDigits.length >= 7) {
      const existingSnap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(db, COLLECTION_NAME));
      const isDuplicate = existingSnap.docs.some((docSnap) => {
        const data = docSnap.data();
        if (!data || !data.phoneNumber) return false;
        const existingRaw = String(data.phoneNumber).replace(/\D/g, "");
        const existingDigits = existingRaw.length >= 9 ? existingRaw.slice(-9) : existingRaw;
        return existingDigits && existingDigits === targetDigits;
      });
      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          error: "This phone number has already been used to confirm an RSVP. Each phone number can only confirm once."
        });
      }
    }
    const rsvpId = typeof id === "string" && /^[a-zA-Z0-9_\-]+$/.test(id.trim()) ? id.trim() : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const generatedCode = `AS-26-${import_crypto2.default.randomBytes(3).toString("hex").toUpperCase()}`;
    const qrToken = import_crypto2.default.randomBytes(32).toString("hex");
    const qrTokenHash = import_crypto2.default.createHash("sha256").update(qrToken).digest("hex");
    const timestamp = typeof submittedAt === "string" && submittedAt.trim().length > 0 ? submittedAt.trim() : (/* @__PURE__ */ new Date()).toISOString();
    const cleanPayload = {
      id: rsvpId,
      fullName: cleanFullName,
      phoneNumber: cleanPhone,
      willAttend,
      adultsCount: willAttend === "yes" ? 1 : 0,
      childrenCount: 0,
      submittedAt: timestamp,
      eCardCode: generatedCode,
      qrTokenHash,
      checkInStatus: "unused",
      checkedInAt: null
    };
    if (notes && typeof notes === "string" && notes.trim().length > 0) {
      cleanPayload.notes = notes.trim().slice(0, 500);
    }
    if (songRequest && typeof songRequest === "string" && songRequest.trim().length > 0) {
      cleanPayload.songRequest = songRequest.trim().slice(0, 200);
    }
    const finalDoc = {};
    for (const [k, v] of Object.entries(cleanPayload)) {
      if (v !== void 0 && v !== null) {
        finalDoc[k] = v;
      }
    }
    await (0, import_firestore.setDoc)((0, import_firestore.doc)(db, COLLECTION_NAME, rsvpId), finalDoc);
    return res.status(200).json({
      success: true,
      message: "RSVP submitted successfully",
      rsvp: { ...Object.fromEntries(Object.entries(finalDoc).filter(([key]) => key !== "qrTokenHash")), qrToken }
    });
  } catch (err) {
    console.error("Error saving RSVP to Firestore:", err?.message || err);
    return res.status(500).json({
      success: false,
      error: "Unable to record your RSVP. Please try again."
    });
  }
});
app.post("/api/admin/login", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { passcode } = req.body || {};
  if (!passcode || typeof passcode !== "string" || !validatePasscode(passcode)) {
    return res.status(401).json({
      success: false,
      error: "Incorrect passcode. Please enter the valid Couple Admin Portal passcode."
    });
  }
  const token = generateAdminToken();
  return res.status(200).json({ success: true, token });
});
var requireAdmin = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: Passcode authentication required." });
  }
  const token = authHeader.split(" ")[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid or expired admin token." });
  }
  next();
};
app.post("/api/admin/check-in", requireAdmin, async (req, res) => {
  try {
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ success: false, status: "invalid", message: "Invalid QR code." });
    }
    const tokenHash = import_crypto2.default.createHash("sha256").update(token).digest("hex");
    const matches = await (0, import_firestore.getDocs)((0, import_firestore.query)((0, import_firestore.collection)(db, COLLECTION_NAME)));
    const match = matches.docs.find((item) => item.data().qrTokenHash === tokenHash);
    if (!match) {
      return res.status(404).json({ success: false, status: "invalid", message: "INVALID QR \u2014 no matching invitation." });
    }
    const guestRef = (0, import_firestore.doc)(db, COLLECTION_NAME, match.id);
    const result = await (0, import_firestore.runTransaction)(db, async (transaction) => {
      const current = await transaction.get(guestRef);
      if (!current.exists()) return { status: "invalid" };
      const guest = current.data();
      if (guest.willAttend !== "yes") return { status: "declined", guest };
      if (guest.checkInStatus === "used" || guest.checkedInAt) {
        return { status: "used", guest };
      }
      const checkedInAt = (/* @__PURE__ */ new Date()).toISOString();
      transaction.update(guestRef, { checkInStatus: "used", checkedInAt });
      return { status: "granted", guest: { ...guest, checkInStatus: "used", checkedInAt } };
    });
    if (result.status === "granted") return res.status(200).json({ success: true, status: result.status, message: "ACCESS GRANTED", guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode, checkedInAt: result.guest.checkedInAt } });
    if (result.status === "used") return res.status(409).json({ success: false, status: "used", message: "ALREADY USED \u2014 ACCESS DENIED", guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode, checkedInAt: result.guest.checkedInAt } });
    if (result.status === "declined") return res.status(403).json({ success: false, status: "declined", message: "RSVP DECLINED \u2014 ACCESS DENIED", guest: { fullName: result.guest.fullName, eCardCode: result.guest.eCardCode } });
    return res.status(404).json({ success: false, status: "invalid", message: "INVALID QR \u2014 no matching invitation." });
  } catch (err) {
    console.error("Check-in error:", err?.message || err);
    return res.status(500).json({ success: false, status: "error", message: "Unable to verify QR. Check your connection and try again." });
  }
});
app.get("/api/admin/rsvps", requireAdmin, async (req, res) => {
  try {
    const q = (0, import_firestore.query)((0, import_firestore.collection)(db, COLLECTION_NAME), (0, import_firestore.orderBy)("submittedAt", "desc"));
    const querySnapshot = await (0, import_firestore.getDocs)(q);
    const rsvps = [];
    querySnapshot.forEach((d) => {
      rsvps.push(d.data());
    });
    return res.status(200).json({ success: true, rsvps });
  } catch (err) {
    console.error("Admin fetch error:", err);
    return res.status(500).json({ success: false, error: "Failed to retrieve RSVPs from Firestore." });
  }
});
var handleUpdateRsvp = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "RSVP ID is required." });
    }
    const { willAttend, adultsCount, childrenCount } = req.body || {};
    const docRef = (0, import_firestore.doc)(db, COLLECTION_NAME, id);
    const existing = await (0, import_firestore.getDoc)(docRef);
    if (!existing.exists()) {
      return res.status(404).json({ success: false, error: "RSVP record not found." });
    }
    const updates = {};
    if (willAttend === "yes" || willAttend === "no") updates.willAttend = willAttend;
    if (typeof adultsCount === "number") updates.adultsCount = adultsCount;
    if (typeof childrenCount === "number") updates.childrenCount = childrenCount;
    await (0, import_firestore.updateDoc)(docRef, updates);
    const updatedDoc = await (0, import_firestore.getDoc)(docRef);
    return res.status(200).json({ success: true, rsvp: updatedDoc.data() });
  } catch (err) {
    console.error("Admin update error:", err);
    return res.status(500).json({ success: false, error: "Failed to update RSVP in Firestore." });
  }
};
app.patch("/api/admin/rsvps", requireAdmin, handleUpdateRsvp);
app.patch("/api/admin/rsvps/:id", requireAdmin, handleUpdateRsvp);
var handleDeleteRsvp = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "RSVP ID is required." });
    }
    await (0, import_firestore.deleteDoc)((0, import_firestore.doc)(db, COLLECTION_NAME, id));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin delete error:", err);
    return res.status(500).json({ success: false, error: "Failed to delete RSVP from Firestore." });
  }
};
app.delete("/api/admin/rsvps", requireAdmin, handleDeleteRsvp);
app.delete("/api/admin/rsvps/:id", requireAdmin, handleDeleteRsvp);
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(db, COLLECTION_NAME));
    let totalRsvps = 0;
    let totalAttending = 0;
    let totalDeclined = 0;
    snap.forEach((d) => {
      const data = d.data();
      totalRsvps++;
      if (data.willAttend === "yes") totalAttending++;
      if (data.willAttend === "no") totalDeclined++;
    });
    return res.status(200).json({ success: true, totalRsvps, totalAttending, totalDeclined });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ success: false, error: "Failed to calculate stats." });
  }
});
async function startServer() {
  const PORT = Number(process.env.PORT) || 3e3;
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}
startServer().catch((err) => {
  console.error("Server failed to start:", err);
});
var server_default = app;
//# sourceMappingURL=server.cjs.map
