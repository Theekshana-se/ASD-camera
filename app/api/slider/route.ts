import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
    try {
        const slides = await prisma.sliderItem.findMany({
            where: { active: true },
            orderBy: { order: "asc" },
        });
        return NextResponse.json(slides);
    } catch (error) {
        console.error("Error fetching slider items:", error);
        return NextResponse.json({ error: "Failed to fetch slider items" }, { status: 500 });
    }
}
