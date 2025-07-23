import SubCategoryModel from "../models/subCategoryModel.js";

export async function AddSubCategoryController(request, response) {
  try {
    const { name, image, category } = request.body;
    if (!name && !image && !category) {
      return response.status(400).json({
        message: "Enter name, image, category",
        success: false,
        error: true,
      });
    }
    const addSubCategory = new SubCategoryModel({
      name,
      image,
      category,
    });
    const saveSubCategory = await addSubCategory.save();
    if (!saveSubCategory) {
      return response.status(400).json({
        message: "Not created",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Sub Category added",
      date: saveSubCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function GetSubCategoryConroller(request, response) {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return response.json({
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function UpdateSubCategoryController(request, response) {
  try {
    const { _id, name, image, category } = request.body;
    const checkSub = await SubCategoryModel.findById(_id);
    if (!checkSub) {
      return response.status(400).json({
        message: "Check your id",
        error: true,
        success: false,
      });
    }
    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });
    return response.json({
      message: "Sub category updated",
      data: updateSubCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function DeleteSubCategoryController(request, response) {
  try {
    const { _id } = request.body;
    const deleteSubCategory = await SubCategoryModel.findByIdAndDelete(_id);
    return response.json({
      message: "Sub Category deleted successfully",
      data:deleteSubCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
