import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userId,
      courtId,
      bookingDate,
      startTime,
      duration,
    } = body;

    // --------------------------------------------------
    // Validate required fields
    // --------------------------------------------------

    if (
      userId === undefined ||
      courtId === undefined ||
      !bookingDate ||
      !startTime ||
      duration === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required booking information.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Convert values
    // --------------------------------------------------

    const parsedUserId = Number(userId);
    const parsedCourtId = Number(courtId);
    const parsedDuration = Number(duration);

    if (
      !Number.isInteger(parsedUserId) ||
      !Number.isInteger(parsedCourtId) ||
      !Number.isInteger(parsedDuration)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking information.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate duration
    // --------------------------------------------------

    if (parsedDuration < 1 || parsedDuration > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Duration must be between 1 and 3 hours.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate time format
    // --------------------------------------------------

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timeRegex.test(startTime)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid start time.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate booking date
    // --------------------------------------------------

    const date = new Date(bookingDate);

    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking date.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Find court
    // --------------------------------------------------

    const court = await prisma.court.findUnique({
      where: {
        id: parsedCourtId,
      },
    });

    if (!court || !court.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "This court is unavailable.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: parsedUserId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Calculate total
    // --------------------------------------------------

    const totalPrice = court.priceHour * parsedDuration;

    // --------------------------------------------------
    // Create booking
    //
    // PostgreSQL unique constraint:
    //
    // courtId + bookingDate + startTime
    //
    // prevents two users from booking the same slot.
    // --------------------------------------------------

    try {
      const booking = await prisma.booking.create({
        data: {
          userId: parsedUserId,
          courtId: parsedCourtId,
          bookingDate: date,
          startTime,
          duration: parsedDuration,
          totalPrice,
          status: "CONFIRMED",
        },
        include: {
          court: {
            include: {
              venue: true,
            },
          },
          user: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Booking confirmed.",
          booking,
        },
        { status: 201 }
      );
    } catch (error) {
      // ------------------------------------------------
      // Duplicate booking
      // ------------------------------------------------

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This court was just booked by another player. Please choose another time.",
          },
          { status: 409 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the booking.",
      },
      { status: 500 }
    );
  }
}