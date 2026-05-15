import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for Google Drive files
// This avoids CORS issues and Google Drive redirect chains
// Usage: /api/drive-file/[fileId]?type=image|video|pdf

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey || !fileId) {
        return NextResponse.json({ error: 'Missing API key or file ID' }, { status: 400 });
    }

    try {
        // First try the direct download URL
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

        const res = await fetch(downloadUrl, {
            headers: {
                'Accept': '*/*',
            },
        });

        if (!res.ok) {
            // Fallback: try thumbnail URL for images
            const thumbUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${apiKey}`;
            const thumbRes = await fetch(thumbUrl);
            const thumbData = await thumbRes.json();

            if (thumbData.thumbnailLink) {
                // Fetch the thumbnail and proxy it
                const imgRes = await fetch(thumbData.thumbnailLink.replace('=s220', '=s1600'));
                if (imgRes.ok) {
                    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
                    const buffer = await imgRes.arrayBuffer();
                    return new NextResponse(buffer, {
                        headers: {
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                        },
                    });
                }
            }

            return NextResponse.json({ error: 'File not accessible' }, { status: 404 });
        }

        const contentType = res.headers.get('content-type') || 'application/octet-stream';
        const buffer = await res.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Drive proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }
}
