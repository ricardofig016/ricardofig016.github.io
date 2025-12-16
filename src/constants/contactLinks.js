import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa6";

export const contactLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/ricardofig016",
    icon: FaGithub,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ricardo-figueiredo-ba5245235",
    icon: FaLinkedin,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:ricardocastrofigueiredo@gmail.com",
    icon: FaEnvelope,
  },
  {
    id: "phone",
    label: "Phone",
    href: "tel:+351967381109",
    icon: FaPhone,
  },
];
