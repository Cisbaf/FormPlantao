import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request) {
    const { search } = new URL(req.url);
    return await proxyFetch(`/formularios${search}`, {
        method: "GET",
        cache: "no-store",
    });
}

export async function POST(req: Request) {
    const body = await req.text();
    return await proxyFetch(`/formularios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}
