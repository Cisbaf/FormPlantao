import { NextResponse } from "next/server";

const BackEndURL = process.env.BACKEND_URL;
console.log(BackEndURL);

export async function proxyFetch(path: string, init?: RequestInit) {
    if (!BackEndURL) {
        return NextResponse.json(
            { message: "Bad gateway", detail: "BackEndURL não configurado" },
            { status: 502 }
        );
    }
    try {
        const modifiedInit = { ...init };

        if (modifiedInit.body &&
            ['POST', 'PUT', 'PATCH'].includes(modifiedInit.method?.toUpperCase() || '')) {
            // @ts-ignore
            modifiedInit.duplex = 'half';
        }

        const res = await fetch(`${BackEndURL}${path}`, {
            ...modifiedInit,
            credentials: "omit"
        });

        if (res.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const bodyText = await res.text();

        const nextRes = new NextResponse(bodyText, {
            status: res.status,
            headers: {
                "content-type": res.headers.get("content-type") ?? "application/json",
            },
        });

        return nextRes;
    } catch (err: any) {
        console.error("proxyFetch network error:", err);
        return NextResponse.json(
            { message: "Bad gateway", detail: err?.message ?? String(err) },
            { status: 502 }
        );
    }
}
