import { LOGO } from "@/data/site";

// `invert` renders the logo white (for dark backgrounds like the footer).
export const Logo = ({ invert = false, className = "" }) => (
  <img
    src={LOGO}
    alt="Julio Cascante · Cardiólogo"
    className={`h-9 sm:h-10 w-auto object-contain ${invert ? "brightness-0 invert" : ""} ${className}`}
  />
);
