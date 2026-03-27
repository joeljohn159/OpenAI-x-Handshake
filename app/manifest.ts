import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CampusShare",
    short_name: "CampusShare",
    description:
      "A community-verified campus map for free food, pantry shelves, supplies, and student resource sharing.",
    start_url: "/map",
    display: "standalone",
    background_color: "#FEFAE0",
    theme_color: "#2D6A4F",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
