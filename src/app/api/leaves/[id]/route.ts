import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return ApiResponse.unauthorized();

    const leave = await prisma.leave.findUnique({
      where: { id: params.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            position: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    if (!leave) return ApiResponse.notFound();
    return ApiResponse.success(leave);
  } catch (error) {
    return ApiResponse.serverError();
  }
}
