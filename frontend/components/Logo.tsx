// components/Logo.tsx
import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center">
      <Image
        src="/brand/tbirdtrader-logo.png"
        alt="TbirdTrader"
        width={size * 5}
        height={size}
        priority
      />
    </div>
  );
}
