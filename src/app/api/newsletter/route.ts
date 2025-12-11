import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface NewsletterFormData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterFormData = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: true, message: "Already subscribed" },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: { isActive: true, subscribedAt: new Date() },
        });
        return NextResponse.json(
          { success: true, message: "Subscription reactivated" },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email },
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
