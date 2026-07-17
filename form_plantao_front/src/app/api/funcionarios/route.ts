import { proxyFetch } from "@/lib/proxyfetch";

export async function GET(req: Request) {
    return await proxyFetch(`/funcionarios`, {
        method: "GET",
        cache: "no-store",
    });
}

export async function POST(req: Request) {
    const body = await req.text();
    return await proxyFetch(`/funcionarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });
}
