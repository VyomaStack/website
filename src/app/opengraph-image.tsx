import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VyomaStack — AI-Powered Developer Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            V
          </div>
          <span style={{ fontSize: 56, fontWeight: 700, color: "white" }}>
            VyomaStack
          </span>
        </div>
        <p style={{ fontSize: 32, color: "#94a3b8", margin: 0 }}>
          AI-Powered Developer Platform
        </p>
        <p
          style={{
            fontSize: 24,
            color: "#60a5fa",
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          Build Faster. Ship Smarter.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
            fontSize: 18,
            color: "#cbd5e1",
          }}
        >
          <span>SQL Formatter</span>
          <span>·</span>
          <span>JSON Formatter</span>
          <span>·</span>
          <span>JWT Decoder</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
