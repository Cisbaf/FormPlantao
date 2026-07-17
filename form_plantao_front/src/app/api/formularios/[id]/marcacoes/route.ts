import { proxyFetch } from "@/lib/proxyfetch";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.text();
    const resolvedParams = await params;
    return await proxyFetch(`/formularios/${resolvedParams.id}/marcacoes`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });
}
