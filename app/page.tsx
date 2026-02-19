export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#0f172a,#000,#fff)",
      color: "white",
      fontFamily: "system-ui"
    }}>
      <div style={{
        background: "rgba(0,0,0,0.6)",
        padding: "32px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.15)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{ color: "#3b82f6", fontSize: "32px", margin: 0 }}>
          Fiká
        </h1>
        <p style={{ marginTop: "10px", opacity: 0.8 }}>
          Deploy test page working ✅
        </p>
      </div>
    </main>
  );
}
