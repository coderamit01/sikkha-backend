import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../helpers/appError";
import { IRequestUser, ITutorAvailability, IUpdateTutorAvailability } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { TutorFilters, TutorUpdateProfile } from "../../type/tutor";

const getAllTutors = async (filters: TutorFilters = {}, page: number = 1, limit: number = 12) => {

  const { category, minPrice, maxPrice, minRating, search } = filters;

  const categories = category ? Array.isArray(category) ? category : [category] : []


  const addFilter: Prisma.TutorWhereInput[] = [];
  if (search) {
    addFilter.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { bio: { contains: search, mode: "insensitive" } } },
      ]
    })
  }

  if (categories.length > 0) {
    addFilter.push(
      {
        category: {
          some: {
            OR: categories.map((cat) => ({
              name: {
                equals: cat,
                mode: "insensitive"
              }
            }))
          }
        }
      }
    )
  }

  if (minPrice) {
    addFilter.push({
      hourlyRate: { gte: minPrice }
    })
  }

  if (maxPrice) {
    addFilter.push({
      hourlyRate: { lte: maxPrice }
    })
  }
  if (minRating) {
    addFilter.push({
      averageRating: { gte: minRating }
    })
  }

  const where: Prisma.TutorWhereInput = {
    AND: addFilter
  }
  const skip = (page - 1) * limit;

  const tutors = await prisma.tutor.findMany({
    where,
    skip,
    take: limit,
    include: {
      user: true,
      category: true,
      bookings: true,
      reviews: true,
      availability: true
    }
  });

  const total = await prisma.tutor.count({ where })
  return {
    tutors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
};

const getAllAvailability = async (user: IRequestUser) => {

  if (user.role !== UserRole.TUTOR) { throw new AppError("Only tutors can get their availability", 403) }

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });

  if (!tutor) { throw new AppError("Tutor not found", 404) }

  const result = await prisma.availability.findMany({
    where: { tutorId: tutor.id },
    orderBy: { createdAt: "asc" }
  });
  return result;
};


const getTutorById = async (id: string) => {
  return await prisma.tutor.findUnique({
    where: {
      id
    },
    include: {
      user: true,
      category: true,
      bookings: true,
      reviews: true,
      availability: true
    }
  });
};

const updateProfile = async (user: IRequestUser, payload: Partial<TutorUpdateProfile>) => {

  if (user.role !== UserRole.TUTOR) { throw new AppError("Only tutors can update profile", 403) }

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });

  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }
  const { name, email, image, bio, ...tutorData } = payload
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image && { image }),
        ...(bio && { bio })
      },
    });

    const updatedTutor = await tx.tutor.update({
      where: { id: tutor.id },
      data: tutorData,
      include: {
        user: true
      }
    });

    return updatedTutor;
  });

  return result;

};

const createAvailability = async (user: IRequestUser, payload: ITutorAvailability) => {
  const { startTime, endTime, day } = payload;

  if (user.role !== UserRole.TUTOR) { throw new AppError("Only tutors can create availability", 403) }

  const tutor = await prisma.tutor.findUnique({ where: { userId: user.userId } });
  if (!tutor) { throw new AppError("Tutor not found", 404) }

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h! * 60 + m!;
  }

  if (toMinutes(startTime) >= toMinutes(endTime)) { throw new AppError("Start time must be before end time", 400); }

  const existAvailability = await prisma.availability.findFirst({
    where: {
      tutorId: tutor.id,
      day,
      startTime: { lte: startTime },
      endTime: { gte: endTime }
    }
  });

  if (existAvailability) { throw new AppError("Availability overlaps with an existing slot", 409) }

  const result = await prisma.availability.create({
    data: {
      tutorId: tutor.id,
      ...payload
    }
  })
  return result;
}

const updateAvialability = async (user: IRequestUser, availableId: string, payload: Partial<ITutorAvailability>) => {
  const { startTime, endTime, day } = payload;

  if (user.role !== UserRole.TUTOR) { throw new AppError("Only tutors can update availability", 403) }

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });

  if (!tutor) { throw new AppError("You are not a registered tutor", 404) }

  const availability = await prisma.availability.findUnique({ where: { id: availableId } });
  if (!availability) { throw new AppError("Availability not found", 404) }
  if (availability.tutorId !== tutor.id) { throw new AppError("Unauthorized", 403) }

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h! * 60 + m!;
  }
  if (startTime && endTime) {
    if (toMinutes(startTime) >= toMinutes(endTime)) {
      throw new AppError("Ensuring the start time is less than the end time", 400)
    }
  }



  if (startTime || endTime || day) {
    const effectiveStart = startTime ?? availability.startTime;
    const effectiveEnd = endTime ?? availability.endTime;
    const effectiveDay = day ?? availability.day;

    const overlap = await prisma.availability.findFirst({
      where: {
        tutorId: tutor.id,
        id: { not: availableId },
        day: effectiveDay,
        startTime: { lte: effectiveEnd },
        endTime: { gte: effectiveStart }
      }
    });

    if (overlap) { throw new AppError("Availability overlaps with an existing slot", 409) }
  }

  return await prisma.availability.update({
    where: {
      id: availableId
    },
    data: payload
  })
};

// Tutor only can delete their own availability.
const deleteAvialability = async (user: IRequestUser, availableId: string) => {

  if (user.role !== UserRole.TUTOR) {
    throw new AppError("Only tutors can delete availability", 403)
  }

  const tutor = await prisma.tutor.findUnique(
    {
      where: { userId: user.userId }
    });

  if (!tutor) {
    throw new AppError("You are not a registered tutor", 404)
  }
  const availability = await prisma.availability.findUnique({
    where: {
      id: availableId
    }
  })

  if (!availability) {
    throw new AppError("Availability not found", 404)
  }

  if (availability.tutorId !== tutor.id) {
    throw new AppError("You are not authorized to delete this availability", 403)
  }

  const result = await prisma.availability.delete({
    where: {
      id: availableId,
    }
  })
  return result;
}

export const tutorService = {
  getAllTutors,
  updateProfile,
  getAllAvailability,
  createAvailability,
  updateAvialability,
  getTutorById,
  deleteAvialability,
};
