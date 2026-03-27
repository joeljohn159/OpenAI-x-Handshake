import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#FEFAE0"
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 42,
            background: "#F5F1EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 14px 28px rgba(61,56,49,0.12)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 18,
              background: "#2D6A4F",
              clipPath:
                "polygon(0 0, 70% 0, 47% 23%, 74% 50%, 100% 23%, 100% 59%, 76% 82%, 51% 57%, 26% 82%, 0 57%, 24% 32%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 18,
              background: "#F5F1EB",
              clipPath:
                "polygon(27% 0, 38% 0, 63% 24%, 59% 28%, 45% 14%, 18% 39%, 0 23%, 0 12%, 20% 26%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 18,
              background: "#F5F1EB",
              clipPath:
                "polygon(58% 50%, 70% 38%, 100% 69%, 100% 80%, 77% 57%, 64% 69%, 59% 64%, 69% 55%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 18,
              background: "#F5F1EB",
              clipPath:
                "polygon(0 80%, 27% 53%, 39% 65%, 58% 65%, 66% 73%, 53% 86%, 20% 86%, 0 100%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 18,
              background: "#F5F1EB",
              clipPath:
                "polygon(47% 23%, 74% 50%, 63% 61%, 37% 35%)"
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
