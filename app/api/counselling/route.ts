import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { counsellingSchema } from "@/lib/validation";
import { sendCounsellingConfirmation } from "@/lib/mailer";
import { appendLeadToSheet } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = counsellingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    await connectDB();

    const lead = await Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      interestedIn: data.interestedIn,
      message: data.message,
      source: data.source,
    });

    // Save the lead first so nothing is lost even if Sheets/email fail.
    // Both side-effects are best-effort and individually logged.
    const results = await Promise.allSettled([
      appendLeadToSheet({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interestedIn: data.interestedIn,
        message: data.message,
        createdAt: lead.createdAt as Date,
      }),
      sendCounsellingConfirmation({
        name: data.name,
        email: data.email,
        interestedIn: data.interestedIn,
      }),
    ]);

    const [sheetResult, mailResult] = results;

    lead.syncedToSheet = sheetResult.status === "fulfilled";
    lead.emailSent = mailResult.status === "fulfilled";
    await lead.save();

    if (sheetResult.status === "rejected") {
      console.error("Google Sheets append failed:", sheetResult.reason);
    }
    if (mailResult.status === "rejected") {
      console.error("Confirmation email failed:", mailResult.reason);
    }

    return NextResponse.json({ success: true, id: lead._id }, { status: 201 });
  } catch (err) {
    console.error("Counselling submission error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
