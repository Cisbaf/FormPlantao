import { proxyFetch } from "@/lib/proxyfetch";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.text();
    return await proxyFetch(`/formularios/${params.id}/marcacoes`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });
}
