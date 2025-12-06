// src/components/SignaturePadField.jsx
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePadField({ label, fileValue, onChangeFile }) {
  const sigRef = useRef(null);

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
    onChangeFile(null);
  };

  const handleUseSignature = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("Pehle signature draw karo.");
      return;
    }

    // 🔁 IMPORTANT CHANGE: getTrimmedCanvas() → getCanvas()
    const canvas = sigRef.current.getCanvas();
    const dataUrl = canvas.toDataURL("image/png");

    // dataURL → Blob → File
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const safeLabel =
      (label || "signature").toLowerCase().replace(/\s+/g, "_");
    const file = new File([blob], `${safeLabel}.png`, {
      type: "image/png",
    });

    onChangeFile(file);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        background: "#fafafa",
      }}
    >
      <h4 style={{ marginBottom: 8 }}>{label}</h4>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          background: "#fff",
          width: "100%",
          maxWidth: 500,
          height: 180,
          overflow: "hidden",
        }}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 180,
            style: { width: "100%", height: "100%", cursor: "crosshair" },
          }}
        />
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
        <button type="button" onClick={handleUseSignature}>
          Save &amp; Use This
        </button>
      </div>

      {fileValue && (
        <div style={{ marginTop: 4, fontSize: 12, color: "green" }}>
          Selected: {fileValue.name}
        </div>
      )}
    </div>
  );
}
