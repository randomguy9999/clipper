import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from "@/components/ui/card";

interface Props {
  text: string;
}

export const QRCode = ({ text }: Props) => (
  <Card className="p-2 bg-white">
    <QRCodeSVG 
      value={text}
      size={64}
      level="L"
      includeMargin={false}
    />
  </Card>
);