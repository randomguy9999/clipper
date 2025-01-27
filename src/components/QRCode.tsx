import React from 'react';
import QRCodeReact from 'qrcode.react';
import { Card } from "@/components/ui/card";

interface Props {
  text: string;
}

export const QRCode = ({ text }: Props) => (
  <Card className="p-2 bg-white">
    <QRCodeReact 
      value={text}
      size={64}
      level="L"
      includeMargin={false}
    />
  </Card>
);