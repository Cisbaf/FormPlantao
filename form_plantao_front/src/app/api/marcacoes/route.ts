import { proxyFetch } from "@/lib/proxyfetch";

export async function POST(req: Request) {
    const body = await req.text();
    return await proxyFetch(`/marcacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}
