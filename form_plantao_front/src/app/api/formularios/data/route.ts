import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request) {
    const { search } = new URL(req.url);
    return await proxyFetch(`/formularios/data${search}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
}

export async function DELETE(req: Request) {
    const { search } = new URL(req.url);
    return await proxyFetch(`/formularios/data${search}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
}
