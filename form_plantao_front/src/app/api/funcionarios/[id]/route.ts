import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    return await proxyFetch(`/funcionarios/${params.id}`, {
        method: "GET",
        cache: "no-store",
    });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.text();
    return await proxyFetch(`/funcionarios/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body
    });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    return await proxyFetch(`/funcionarios/${params.id}`, {
        method: "DELETE",
    });
}
