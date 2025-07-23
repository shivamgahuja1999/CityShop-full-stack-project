import ProductModel from "../models/productModel.js";

export async function CreateProductController(request, response) {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = request.body;
    if (
      !name ||
      !image?.[0] ||
      !category?.[0] ||
      !subCategory?.[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return response.status(400).json({
        message: "Enter required fileds",
        success: false,
        error: true,
      });
    }
    const addProduct = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    const saveProduct = await addProduct.save();
    if (!saveProduct) {
      return response.status(400).json({
        message: "Not added",
        success: false,
        error: true,
      });
    }
    return response.json({
      message: "Product Added successfully",
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

export async function GetProductController(request, response) {
  try {
    let { page, limit, search } = request.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("subCategory"),
      ProductModel.countDocuments(query),
    ]);
    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getProductByCategory(request, response) {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.find({
      category: { $in: [id] },
    }).limit(15);
    return response.json({
      message: "Category product list",
      data: product,
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

export async function getProductByCategoyAndSubCategoy(request, response) {
  try {
    const { categoryId, subCategoryId, page, limit } = request.body;
    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Please provide categoryId & subCategoryId",
        error: true,
        success: false,
      });
    }
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };
    const skip = (page - 1) * limit;
    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);
    return response.json({
      message: "Product List",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
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

export async function GetProductDetails(request, response) {
  try {
    const { productId } = request.body;
    const product = await ProductModel.findOne({ _id: productId });
    return response.json({
      message: "Producy details",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UpdateProductDetails(request, response) {
  try {
    const { _id } = request.body;
    if (!_id) {
      return response.status(400).json({
        message: "Provide product id",
        success: false,
        error: true,
      });
    }
    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...request.body,
      }
    );
    return response.json({
      message: "Update successfully",
      data: updateProduct,
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

export async function DeleteProductDetails(request, response) {
  try {
    const { _id } = request.body;
    if (!_id) {
      return response.status(400).json({
        message: "Please provide _id",
        success: false,
        error: true,
      });
    }
    const deleteProduct = await ProductModel.deleteOne({ _id: _id });
    return response.json({
      message: "Delete product successfully",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function SearchProduct(request, response) {
  try {
    let { page, limit, search } = request.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("subCategory"),
      ProductModel.countDocuments(query),
    ]);
    return response.json({
      message: "Product data",
      data: data,
      totalCount: totalCount,
      totalPage:Math.ceil(totalCount/limit),
      page: page,
      limit: limit,
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
