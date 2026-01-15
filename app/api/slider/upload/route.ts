import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Forward to the server API
        const serverFormData = new FormData();
        serverFormData.append("file", file);

        const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
        const response = await fetch(`${serverUrl}/api/slider/upload`, {
            method: "POST",
            body: serverFormData,
        });

        if (!response.ok) {
            throw new Error("Server upload failed");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
