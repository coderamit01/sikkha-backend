import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { addCategoryPayload, typeCategory } from "../../type/category";

const getAllCategory = async () => {
  return await prisma.category.findMany({
    include: {
      tutors: true
    }
  });
}
const getMyAllCategory = async (user: IRequestUser) => {
  if (user.role !== UserRole.TUTOR) {
    throw new AppError("Only tutors can access their categories", 403);
  }
  const tutor = await prisma.tutor.findUnique({
    where: {
      userId: user.userId
    }
  })
  if (!tutor) {
    throw new AppError("Tutor profile not found", 403);
  }
  return await prisma.category.findMany({
    where: {
      tutors: {
        some: {
          id: tutor.id
        }
      }
    }
  });
}

const addCategoryInProfile = async (user: IRequestUser, payload: addCategoryPayload) => {
  if (user.role !== UserRole.TUTOR) {
    throw new AppError("Only tutors can add their categories", 403);
  }
  const tutor = await prisma.tutor.findUnique({
    where: {
      userId: user.userId
    }
  })
  if (!tutor) {
    throw new AppError("Tutor profile not found", 403);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId
    }
  })
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const existingConnection = await prisma.tutor.findUnique({
    where: {
      id: tutor.id,
      category: {
        some: {
          id: payload.categoryId
        }
      }
    }
  })
  if (existingConnection) {
    throw new AppError("Category already added to this tutor profile", 409);
  }

  return await prisma.tutor.update({
    where: {
      id: tutor.id
    },
    data: {
      category: {
        connect: {
          id: payload.categoryId
        }
      }
    },
    include: {
      category: true
    }
  });
}

const getSingleCategory = async (id: string) => {
  return await prisma.category.findUnique({
    where: {
      id
    }
  });
}

const createCategory = async (payload: typeCategory) => {
  const categorySlug = payload.name.toLocaleLowerCase().replace(" ", "-").trim();
  return await prisma.category.create({
    data: {
      ...payload,
      slug: categorySlug
    }
  });
}

const updateCategory = async (id: string, payload: typeCategory) => {
  const categorySlug = payload.name.toLocaleLowerCase().replace(" ", "-").trim();
  return await prisma.category.update({
    where: {
      id: id
    },
    data: {
      ...payload,
      slug: categorySlug
    }
  });
}

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: {
      id
    }
  });
}

const deleteCategoryFromProfile = async (user: IRequestUser, categoryId: string) => {
  if (user.role !== UserRole.TUTOR) {
    throw new AppError("Only tutors can add their categories", 403);
  }
  const tutor = await prisma.tutor.findUnique({
    where: {
      userId: user.userId
    }
  })
  if (!tutor) {
    throw new AppError("Tutor profile not found", 403);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  })
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const existingConnection = await prisma.tutor.findUnique({
    where: {
      id: tutor.id,
      category: {
        some: {
          id: categoryId
        }
      }
    }
  })
  if (!existingConnection) {
    throw new AppError("Category not found in this tutor's profile", 404);
  }

  return await prisma.tutor.update({
    where: {
      id: tutor.id
    },
    data: {
      category: {
        disconnect: {
          id: categoryId
        }
      }
    },
    include: {
      category: true
    }
  });
}

export const categoryService = {
  createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory, getMyAllCategory, addCategoryInProfile, deleteCategoryFromProfile,
}