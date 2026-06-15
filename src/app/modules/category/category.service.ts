import { prisma } from "../../lib/prisma";
import { typeCategory } from "../../type/category";

const getAllCategory = async () => {
  return await prisma.category.findMany({
    include: {
      tutors: true
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

export const categoryService = {
  createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory,
}