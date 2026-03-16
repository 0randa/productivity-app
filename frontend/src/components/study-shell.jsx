import { NavbarComp } from "@/components/navbar";

export default function StudyShell({ children }) {
  return (
    <div className="grass-world">
      <div className="sky-clouds" aria-hidden="true" />
      <NavbarComp />
      <div className="pixel-trees" />
      <div className="poke-container main-content">
        {children}
      </div>
    </div>
  );
}
