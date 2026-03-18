import { NavbarComp } from "@/components/navbar";

export default function StudyShell({ children }) {
  return (
    <div className="grass-world">
      <NavbarComp />
      <div className="sky-clouds" aria-hidden="true" />
      <div className="pixel-trees" />
      <div className="poke-container main-content">
        {children}
      </div>
    </div>
  );
}
