import { NavbarComp } from "@/components/navbar";

export default function StudyShell({ children }) {
  return (
    <div className="grass-world">
      <NavbarComp />
      <div className="sky-clouds" aria-hidden="true" />
      <div className="mountain-layer" aria-hidden="true" />
      <div className="hill-layer" aria-hidden="true" />
      <div className="pixel-trees" aria-hidden="true" />
      <div className="poke-container main-content">
        {children}
      </div>
    </div>
  );
}
