const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const FORM_POINTS = {
  "fwc-preferences": 20,
  "feedback-form": 10,
  "delegate-school": 15,
  "delegate-independent": 15,
  "advisor-signup": 10,
  "chair-applications": 25,
};

const getClarifaiPat = () => {
  return (
    process.env.CLARIFAI_PAT ||
    (functions.config().clarifai && functions.config().clarifai.pat) ||
    ""
  );
};

const extractOcrText = (clarifaiResponse) => {
  const outputs = clarifaiResponse.outputs || [];
  const texts = [];
  outputs.forEach((output) => {
    const regions = output?.data?.regions || [];
    regions.forEach((region) => {
      const raw = region?.data?.text?.raw;
      if (raw) {
        texts.push(raw);
      }
    });
  });
  return texts.join(" ").toLowerCase();
};

const hasGoogleFormsEvidence = (ocrText) => {
  if (!ocrText) {
    return false;
  }
  return (
    ocrText.includes("forms.gle") ||
    ocrText.includes("docs.google.com/forms") ||
    (ocrText.includes("google") && ocrText.includes("forms"))
  );
};

exports.verifyProof = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign in to submit proof."
    );
  }

  const { formId, proofUrl } = data || {};
  if (!formId || !FORM_POINTS[formId] || !proofUrl) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing proof data."
    );
  }

  const clarifaiPat = getClarifaiPat();
  if (!clarifaiPat) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Clarifai PAT not configured."
    );
  }

  const clarifaiResponse = await fetch(
    "https://api.clarifai.com/v2/models/ocr-scene-english/outputs",
    {
      method: "POST",
      headers: {
        Authorization: `Key ${clarifaiPat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                url: proofUrl,
              },
            },
          },
        ],
      }),
    }
  );

  const clarifaiJson = await clarifaiResponse.json();
  if (!clarifaiResponse.ok) {
    throw new functions.https.HttpsError(
      "internal",
      clarifaiJson?.status?.description || "Clarifai OCR failed."
    );
  }

  const ocrText = extractOcrText(clarifaiJson);
  const verified = hasGoogleFormsEvidence(ocrText);
  const verificationStatus = verified ? "verified" : "rejected";

  const db = admin.firestore();
  const uid = context.auth.uid;
  const userRef = db.collection("users").doc(uid);

  const result = await db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const userData = userSnap.data() || {};
    const completions = userData.completions || {};
    const refCode = userData.refCode || uid.slice(0, 8);
    const referralRef = db.collection("referrals").doc(refCode);
    const referralSnap = await tx.get(referralRef);
    const referralData = referralSnap.data() || {};
    const visitCount = Number(referralData.visitCount || 0);

    if (visitCount < 1) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "referral-required"
      );
    }
    if (completions[formId]) {
      return { status: "already", points: userData.points || 0 };
    }

    const proofs = userData.proofs || {};
    proofs[formId] = {
      url: proofUrl,
      status: verificationStatus,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      ocrSnippet: ocrText.slice(0, 200),
    };

    const updates = {
      proofs,
      email: userData.email || "",
    };

    if (verified) {
      const newPoints = Number(userData.points || 0) + FORM_POINTS[formId];
      completions[formId] = true;
      updates.points = newPoints;
      updates.completions = completions;
    }

    tx.set(userRef, updates, { merge: true });
    return { status: verificationStatus, points: updates.points || userData.points || 0 };
  });

  return result;
});
