import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: "Name, phone, and service are required" },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || null,
        service: body.service.trim(),
        message: body.message?.trim() || null,
      },
    });

    // Send email notification
    try {
      await sendContactNotification({
        name: submission.name,
        phone: submission.phone,
        email: submission.email ?? undefined,
        service: submission.service,
        message: submission.message ?? undefined,
        submissionId: submission.id,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      // The submission is saved, assistant can still see it in the database
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cererea a fost trimisa cu succes!",
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "A aparut o eroare. Va rugam incercati din nou." },
      { status: 500 }
    );
  }
}
