import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  text: string;
}

const truncateForQR = (text: string): string => {
  // QR code version 40 with error correction level 'L' can store up to about 2900 bytes
  // We'll use a conservative limit of 2000 characters to ensure reliable generation
  const QR_CHAR_LIMIT = 2000;
  if (text.length <= QR_CHAR_LIMIT) return text;
  return text.substring(0, QR_CHAR_LIMIT) + '...';
};

export const QRCode = ({ text }: Props) => {
  const truncatedText = truncateForQR(text);
  const isTextTruncated = truncatedText !== text;

  const qrCode = (
    <Card className="p-2 bg-white">
      <QRCodeSVG 
        value={truncatedText}
        size={64}
        level="L"
        includeMargin={false}
      />
    </Card>
  );

  if (!isTextTruncated) {
    return qrCode;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {qrCode}
        </TooltipTrigger>
        <TooltipContent>
          <p>Content truncated for QR code generation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};