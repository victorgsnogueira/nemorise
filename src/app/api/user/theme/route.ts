import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const themeSchema = z.object({
  hue: z.number().min(0).max(360),
  saturation: z.number().min(0).max(1),
  lightness: z.number().min(0).max(1),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const themeData = themeSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        theme: themeData,
      },
    });

    return NextResponse.json({ message: "Theme updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Failed to update theme:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 