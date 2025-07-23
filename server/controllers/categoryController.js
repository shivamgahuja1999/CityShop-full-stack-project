import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import SubCategoryModel from "../models/subCategoryModel.js";

export async function AddCategoryController(request, response) {
  try {
    const { name, image } = request.body;
    if (!name || !image) {
      return response.status(400).json({
        message: "Enter required field",
        success: false,
        error: true,
      });
    }
    const addCategory = new CategoryModel({
      name,
      image,
    });
    const saveCategory = await addCategory.save();
    if (!saveCategory) {
      return response.status(400).json({
        message: "Not created",
        error: true,
        success: false,
      });
    }
    return response.json({
      message: "Category added",
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

export async function GetCategoryController(request, response) {
  try {
    const data = await CategoryModel.find().sort({createdAt:-1});
    return response.json({
      data: data,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UpdateCategoryController(request, response) {
  try {
    const { _id, name, image } = request.body;
    const update = await CategoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      }
    );
    return response.json({
      message: "Category updated",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteCategoryController(request, response) {
  try {
    const { _id } = request.body;
    const checkSubCategory = await SubCategoryModel.find({
      category: {
        $in: { _id },
      },
    }).countDocuments(); //used to count the number of documents in a collection that match a specified query.

    const checkProduct = await ProductModel.find({
      category: {
        $in: { _id },
      },
    }).countDocuments();

    if (
      checkSubCategory.countDocuments > 0 ||
      checkProduct.countDocuments > 0
    ) {
      return response.status(400).json({
        message: "Category already in use, can't deleted",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({
      _id: _id,
    });
    return response.json({
      message:"Category deleted successfully",
      success:true,
      error:false
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
