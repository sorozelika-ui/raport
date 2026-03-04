const TelephoneAppel = ({ telephone }) => {
  return (
    <div
      style={{
        width: "140px",
        height: "260px",
        backgroundColor: "#111",
        borderRadius: "20px",
        padding: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(to bottom, #0f172a, #1e293b)",
          height: "100%",
          borderRadius: "12px",
          padding: "10px 6px",
          textAlign: "center",
          color: "white",
          fontSize: "10px",
          position: "relative"
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(59, 131, 246, 0.2)",
            padding: "4px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "9px"
          }}
        >
          DGBF-PERFORM
        </div>

        <p style={{ marginTop: "10px" }}>Appel entrant</p>

        <p style={{ fontSize: "9px" }}>
          📱 {telephone}
        </p>

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          ></div>

          <div
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: "green",
              borderRadius: "50%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default TelephoneAppel;