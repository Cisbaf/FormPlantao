import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request) {
    const { search } = new URL(req.url);
    return await proxyFetch(`/marcacoes/contagem-diaria${search}`, {
        method: "GET",
        cache: "no-store",
    });
}
