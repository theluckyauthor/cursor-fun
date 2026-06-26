"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QRShareProps {
  url: string;
}

export function QRShare({ url }: QRShareProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: "#f5f0ff", light: "#0f0a1a00" },
    }).then(setQrDataUrl);
  }, [url]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium transition hover:bg-white/5"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => setShowQr(!showQr)}
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium transition hover:bg-white/5"
      >
        QR
      </button>

      {showQr && qrDataUrl && (
        <div className="absolute right-0 top-full z-50 mt-2 rounded-xl border border-white/15 bg-canvas-surface p-4 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR code to share this site" width={160} height={160} />
          <p className="mt-2 max-w-[160px] truncate text-center text-[10px] text-canvas-muted">
            {url}
          </p>
        </div>
      )}
    </div>
  );
}
