import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request) {
    const { search } = new URL(req.url);
    return await proxyFetch(`/marcacoes/relatorio-geral${search}`, {
        method: "GET",
        cache: "no-store",
    });
}
