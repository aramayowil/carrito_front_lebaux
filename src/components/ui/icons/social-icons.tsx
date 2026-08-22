import type { ReactNode, SVGProps } from "react";

import type { PlataformaSocial } from "@/types";

type PropiedadesIcono = SVGProps<SVGSVGElement>;

function SvgMarca({
  children,
  ...props
}: PropiedadesIcono & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </SvgMarca>
  );
}

export function FacebookSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.196 2.238.196v2.475h-1.26c-1.242 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94" />
    </svg>
  );
}

export function WhatsappSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.64-.92-2.23-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.17 6.44 6.61 2 12.06 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89" />
    </svg>
  );
}

export function YoutubeSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.85 4.7 12 4.7 12 4.7s-5.85 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.75.5 7.6.5 7.6.5s5.85 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8M10 15.2V8.8l5.5 3.2z" />
    </svg>
  );
}

export function TiktokSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props} strokeWidth="2">
      <path d="M14 4v10.25a4.25 4.25 0 1 1-3.4-4.16" />
      <path d="M14 4c.65 2.55 2.4 4.15 5 4.5" />
    </SvgMarca>
  );
}

export function XSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.1 3h4.35l4.48 6.23L18.15 3H20l-6.22 7.52L20.5 21h-4.36l-4.92-6.83L5.57 21H3.7l6.67-8.12zm3.45 1.55H6.98l10.05 14.9h.58z" />
    </svg>
  );
}

export function LinkedinSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.35 3.5A2.35 2.35 0 1 1 5.35 8.2a2.35 2.35 0 0 1 0-4.7M3.3 9.7h4.1V21H3.3zm6.6 0h3.93v1.55h.06c.55-1.04 1.88-2.14 3.88-2.14 4.15 0 4.92 2.73 4.92 6.29V21h-4.1v-4.97c0-1.19-.02-2.71-1.65-2.71-1.66 0-1.91 1.29-1.91 2.62V21H9.9z" />
    </svg>
  );
}

export function PinterestSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3.46 18.35c-.08-1.57-.02-3.45.39-5.2l1.22-5.17s-.3-.62-.3-1.53c0-1.44.83-2.51 1.87-2.51.88 0 1.31.66 1.31 1.46 0 .89-.57 2.21-.86 3.44-.24 1.03.52 1.87 1.53 1.87 1.84 0 3.25-1.94 3.25-4.74 0-2.48-1.78-4.21-4.33-4.21-2.95 0-4.68 2.21-4.68 4.5 0 .89.34 1.85.77 2.37.08.1.1.18.07.28l-.29 1.18c-.05.19-.15.23-.35.14-1.31-.61-2.13-2.52-2.13-4.05 0-3.3 2.4-6.33 6.91-6.33 3.63 0 6.45 2.59 6.45 6.04 0 3.61-2.28 6.52-5.44 6.52-1.06 0-2.06-.55-2.4-1.2l-.65 2.48c-.24.91-.88 2.05-1.31 2.75.99.31 2.03.48 3.12.48A9.5 9.5 0 0 0 12 2.5" />
    </svg>
  );
}

export function ThreadsSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props} strokeWidth="1.9">
      <path d="M12 3.25c-4.85 0-8 3.25-8 8.75 0 5.45 3.2 8.75 8 8.75 4.6 0 7.5-2.5 7.5-6.1 0-3.14-2.16-5.2-5.6-5.2-2.9 0-4.9 1.55-4.9 3.75 0 1.84 1.43 3.05 3.55 3.05 3.16 0 5.15-2.33 5.15-5.57 0-4.55-2.28-7.43-5.95-7.43-2.64 0-4.62 1.43-5.47 3.72" />
    </SvgMarca>
  );
}

export function TelegramSocialIcon(props: PropiedadesIcono) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.4 3.5 2.9 10.65c-1.26.5-1.25 1.18-.23 1.49l4.75 1.48 1.83 5.7c.22.61.11.85.75.85.5 0 .72-.23 1-.5l2.29-2.23 4.77 3.52c.88.49 1.51.24 1.73-.82L22.72 5c.33-1.34-.51-1.95-1.32-1.5M8.17 13.28l10.72-6.76c.53-.32 1.01-.15.61.2l-8.85 7.99-.35 3.73z" />
    </svg>
  );
}

export function DiscordSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props}>
      <path d="M8.3 7.1A12 12 0 0 1 12 6.5a12 12 0 0 1 3.7.6" />
      <path d="M7.15 5.7c-2.2 3.1-2.8 6.1-2.4 9.05 1.55 1.18 3.05 1.88 4.52 2.22l1.1-1.5" />
      <path d="M16.85 5.7c2.2 3.1 2.8 6.1 2.4 9.05-1.55 1.18-3.05 1.88-4.52 2.22l-1.1-1.5" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M9.25 15c1.85.85 3.65.85 5.5 0" />
    </SvgMarca>
  );
}

export function TwitchSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props}>
      <path d="M5 4h15v10l-4 4h-4l-2.5 2.5V18H5z" />
      <path d="M9 8v5M15 8v5" />
    </SvgMarca>
  );
}

export function SnapchatSocialIcon(props: PropiedadesIcono) {
  return (
    <SvgMarca {...props}>
      <path d="M12 3.5c-2.15 0-3.5 1.65-3.5 4.15 0 .75.1 1.33.18 1.8-.55.4-1.2.7-1.9.85-.55.12-.67.78-.16 1.08.67.39 1.24.56 1.72.65-.18.65-.72 1.5-1.8 2.13-.47.28-.28.98.27 1.02.64.05 1.05.21 1.35.47.58.5.9 1.02 1.83.87.55-.09 1.03-.35 2.01-.35s1.46.26 2.01.35c.93.15 1.25-.37 1.83-.87.3-.26.71-.42 1.35-.47.55-.04.74-.74.27-1.02-1.08-.63-1.62-1.48-1.8-2.13.48-.09 1.05-.26 1.72-.65.51-.3.39-.96-.16-1.08-.7-.15-1.35-.45-1.9-.85.08-.47.18-1.05.18-1.8C15.5 5.15 14.15 3.5 12 3.5" />
    </SvgMarca>
  );
}

export const REDES_SOCIALES_DISPONIBLES: readonly {
  plataforma: PlataformaSocial;
  etiqueta: string;
  placeholder: string;
}[] = [
  {
    plataforma: "instagram",
    etiqueta: "Instagram",
    placeholder: "https://instagram.com/usuario",
  },
  {
    plataforma: "facebook",
    etiqueta: "Facebook",
    placeholder: "https://facebook.com/pagina",
  },
  {
    plataforma: "whatsapp",
    etiqueta: "WhatsApp",
    placeholder: "https://wa.me/5493810000000",
  },
  {
    plataforma: "youtube",
    etiqueta: "YouTube",
    placeholder: "https://youtube.com/@canal",
  },
  {
    plataforma: "tiktok",
    etiqueta: "TikTok",
    placeholder: "https://tiktok.com/@usuario",
  },
  { plataforma: "x", etiqueta: "X", placeholder: "https://x.com/usuario" },
  {
    plataforma: "linkedin",
    etiqueta: "LinkedIn",
    placeholder: "https://linkedin.com/company/empresa",
  },
  {
    plataforma: "pinterest",
    etiqueta: "Pinterest",
    placeholder: "https://pinterest.com/usuario",
  },
  {
    plataforma: "threads",
    etiqueta: "Threads",
    placeholder: "https://threads.net/@usuario",
  },
  {
    plataforma: "telegram",
    etiqueta: "Telegram",
    placeholder: "https://t.me/usuario",
  },
  {
    plataforma: "discord",
    etiqueta: "Discord",
    placeholder: "https://discord.gg/invitacion",
  },
  {
    plataforma: "twitch",
    etiqueta: "Twitch",
    placeholder: "https://twitch.tv/canal",
  },
  {
    plataforma: "snapchat",
    etiqueta: "Snapchat",
    placeholder: "https://snapchat.com/add/usuario",
  },
] as const;

const ICONOS_REDES: Record<
  PlataformaSocial,
  (props: PropiedadesIcono) => ReactNode
> = {
  instagram: InstagramSocialIcon,
  facebook: FacebookSocialIcon,
  whatsapp: WhatsappSocialIcon,
  youtube: YoutubeSocialIcon,
  tiktok: TiktokSocialIcon,
  x: XSocialIcon,
  linkedin: LinkedinSocialIcon,
  pinterest: PinterestSocialIcon,
  threads: ThreadsSocialIcon,
  telegram: TelegramSocialIcon,
  discord: DiscordSocialIcon,
  twitch: TwitchSocialIcon,
  snapchat: SnapchatSocialIcon,
};

export function IconoRedSocial({
  plataforma,
  ...props
}: PropiedadesIcono & { plataforma: PlataformaSocial }) {
  const Icono = ICONOS_REDES[plataforma];
  return <Icono {...props} />;
}

export function obtenerDatosRedSocial(plataforma: PlataformaSocial) {
  return (
    REDES_SOCIALES_DISPONIBLES.find((red) => red.plataforma === plataforma) ??
    REDES_SOCIALES_DISPONIBLES[0]
  );
}
