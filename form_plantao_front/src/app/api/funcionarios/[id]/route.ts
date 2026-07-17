import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return await proxyFetch(`/funcionarios/${resolvedParams.id}`, {
        method: "GET",
        cache: "no-store",
    });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.text();
    const resolvedParams = await params;
    return await proxyFetch(`/funcionarios/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body
    });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return await proxyFetch(`/funcionarios/${resolvedParams.id}`, {
        method: "DELETE",
    });
}
