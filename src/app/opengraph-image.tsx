import { ImageResponse } from "next/og";

export const alt = "Nexus SaaS revenue intelligence dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 70,
        color: "white",
        background: "#0e0e11",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: 999,
          top: -430,
          right: -100,
          background: "rgba(124,92,255,.24)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#7c5cff",
            fontSize: 36,
          }}
        >
          N
        </div>
        Nexus
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
        <div style={{ color: "#a78bfa", fontSize: 24, fontWeight: 600 }}>
          SAAS REVENUE INTELLIGENCE
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 68,
            lineHeight: 1.05,
            letterSpacing: -3,
            fontWeight: 700,
          }}
        >
          See the signals shaping your SaaS growth.
        </div>
        <div style={{ marginTop: 26, color: "#a1a1aa", fontSize: 25 }}>
          Revenue · Customers · Subscriptions · Analytics
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, color: "#71717a", fontSize: 18 }}>
        <span>Next.js 16</span>
        <span>·</span>
        <span>Supabase</span>
        <span>·</span>
        <span>TypeScript</span>
        <span>·</span>
        <span>Vercel</span>
      </div>
    </div>,
    size,
  );
}
