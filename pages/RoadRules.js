import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { auth } from "../firebase";

const RoadRules = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setProgress(doc.data().progress || 0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default RoadRules; 