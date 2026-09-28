import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DocumentItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  let docs = db.documents.filter((d) => d.organizationId === orgId || orgId === 'org-dpw-rwanda');
  if (docs.length === 0) {
    db.documents = [
      {
        id: 'doc-1',
        organizationId: 'org-apex-001',
        shipmentId: 'shp-1',
        title: 'Master Bill of Lading #BOL-9901',
        documentType: 'BILL_OF_LADING',
        fileUrl: '/docs/sample-bol.pdf',
        uploadedBy: 'Elena Rostova',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'VERIFIED',
        ocrData: { carrier: 'DP World Logistics', container: 'MSKU-8840192', weight: '24,500 kg' },
      },
      {
        id: 'doc-2',
        organizationId: 'org-apex-001',
        shipmentId: 'shp-2',
        title: 'Rwanda Customs Declaration #RRA-2026-441',
        documentType: 'CUSTOMS',
        fileUrl: '/docs/sample-customs.pdf',
        uploadedBy: 'Marcus Vance',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'VERIFIED',
        ocrData: { customsOffice: 'Rusumo Border Post', dutyAmount: '$1,240.00' },
      },
      {
        id: 'doc-3',
        organizationId: 'org-apex-001',
        shipmentId: 'shp-3',
        title: 'Signed Proof of Delivery (POD)',
        documentType: 'POD',
        fileUrl: '/docs/sample-pod.pdf',
        uploadedBy: 'John Kabuya (Driver)',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'PENDING',
        ocrData: { recipientName: 'David Miller', timestamp: new Date().toISOString() },
      },
    ];
    docs = db.documents;
  }

  return NextResponse.json({ total: docs.length, documents: docs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      shipmentId: body.shipmentId || 'shp-1',
      title: body.title,
      documentType: body.documentType || 'OTHER',
      fileUrl: body.fileUrl || '/docs/uploaded-file.pdf',
      uploadedBy: body.uploadedBy || 'Dispatcher User',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'VERIFIED',
      ocrData: { parsedAt: new Date().toISOString(), status: 'SUCCESS' },
    };

    db.documents.unshift(newDoc);
    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, documentType, verificationStatus } = body;
    const doc = db.documents.find((d) => d.id === id);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (title) doc.title = title;
    if (documentType) doc.documentType = documentType;
    if (verificationStatus) doc.verificationStatus = verificationStatus;

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { docId, verificationStatus } = body;
    const doc = db.documents.find((d) => d.id === docId);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (verificationStatus) doc.verificationStatus = verificationStatus;

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400 });

    db.documents = db.documents.filter((d) => d.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
