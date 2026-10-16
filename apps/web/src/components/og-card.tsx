type OgCardProps = {
  title: string;
  date: string;
  location: string;
  website: string;
  detail?: string;
  logoSrc: string;
};

export function OgCard({ title, date, location, website, detail, logoSrc }: OgCardProps) {
  const titleSize = title.length > 42 ? 52 : title.length > 22 ? 60 : 76;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          height: "100%",
          paddingTop: 64,
          paddingBottom: 48,
          paddingLeft: 72,
          paddingRight: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {detail ? (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.25,
                color: "#d6d6d6",
              }}
            >
              {detail}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 18, lineHeight: 1.3, color: "#a3a3a3" }}>
            {date}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 18,
              lineHeight: 1.3,
              color: "#a3a3a3",
            }}
          >
            {location}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: -0.4,
              color: "#ffffff",
            }}
          >
            {website}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 560,
          height: "100%",
        }}
      >
        <img src={logoSrc} width={540} height={480} />
      </div>
    </div>
  );
}
