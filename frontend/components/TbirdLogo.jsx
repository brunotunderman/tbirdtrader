import Image from "next/image";

export default function TbirdLogo({ size = 180 }) {
  return (
    <Image
      src="/assets/logo/tbird-full.png"
      alt="TbirdTrader Logo"
      width={size}
      height={40}
      priority
    />
  );
}

