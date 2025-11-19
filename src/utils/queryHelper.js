/**
 * Reusable Query Helper for Search, Filter, Sort, and Pagination
 * 
 * This utility provides a unified interface for building MongoDB queries
 * with support for:
 * - Keyword-based search across multiple fields
 * - Dynamic filtering based on query parameters
 * - Sorting by any model field
 * - Pagination with page and limit
 * 
 * @param {Object} Model - Mongoose model to query
 * @param {Object} queryParams - Request query parameters
 * @param {Array} searchFields - Fields to search in (e.g., ['name', 'email'])
 * @param {Object} options - Additional options (defaultFilters, populate, select)
 * @returns {Object} - { data, pagination }
 */

/**
 * Sanitizes search keyword by removing special characters and trimming
 * @param {string} keyword - Search keyword
 * @returns {string} - Sanitized keyword
 */
const sanitizeKeyword = (keyword) => {
  if (!keyword || typeof keyword !== "string") return "";
  // Remove special characters except spaces and alphanumeric
  return keyword.trim().replace(/[^\w\s]/gi, "");
};

/**
 * Builds search query for keyword-based search
 * @param {string} keyword - Search keyword
 * @param {Array} searchFields - Fields to search in
 * @returns {Object} - MongoDB search query
 */
const buildSearchQuery = (keyword, searchFields) => {
  if (!keyword || !searchFields || searchFields.length === 0) {
    return {};
  }

  const sanitized = sanitizeKeyword(keyword);
  if (!sanitized) return {};

  // Create case-insensitive regex search for each field
  const searchConditions = searchFields.map((field) => ({
    [field]: { $regex: sanitized, $options: "i" },
  }));

  return { $or: searchConditions };
};

/**
 * Builds filter query from request parameters
 * @param {Object} queryParams - Request query parameters
 * @param {Object} defaultFilters - Default filters to always apply
 * @returns {Object} - MongoDB filter query
 */
const buildFilterQuery = (queryParams, defaultFilters = {}) => {
  const filter = { ...defaultFilters };

  // Extract common filter patterns
  const {
    q, // search keyword (handled separately)
    page, // pagination (handled separately)
    limit, // pagination (handled separately)
    sort, // sorting (handled separately)
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    ...otherFilters
  } = queryParams;

  // Handle range filters for numbers
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.base_price = {};
    if (minPrice !== undefined) {
      filter.base_price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      filter.base_price.$lte = Number(maxPrice);
    }
  }

  // Handle rating range filters
  if (minRating !== undefined || maxRating !== undefined) {
    filter.rating = {};
    if (minRating !== undefined) {
      filter.rating.$gte = Number(minRating);
    }
    if (maxRating !== undefined) {
      filter.rating.$lte = Number(maxRating);
    }
  }

  // Handle boolean filters
  Object.keys(otherFilters).forEach((key) => {
    const value = otherFilters[key];
    if (value !== undefined && value !== null && value !== "") {
      // Convert string booleans to actual booleans
      if (value === "true") {
        filter[key] = true;
      } else if (value === "false") {
        filter[key] = false;
      } else {
        // For exact match filters (enum, string, number)
        filter[key] = value;
      }
    }
  });

  return filter;
};

/**
 * Builds sort object from sort parameter
 * @param {string} sortParam - Sort parameter (e.g., "name" or "-createdAt")
 * @returns {Object} - MongoDB sort object
 */
const buildSortQuery = (sortParam) => {
  if (!sortParam || typeof sortParam !== "string") {
    return { createdAt: -1 }; // Default sort by creation date descending
  }

  const sortFields = sortParam.split(",").map((field) => field.trim());
  const sortObject = {};

  sortFields.forEach((field) => {
    if (field.startsWith("-")) {
      // Descending sort
      sortObject[field.substring(1)] = -1;
    } else {
      // Ascending sort
      sortObject[field] = 1;
    }
  });

  return Object.keys(sortObject).length > 0 ? sortObject : { createdAt: -1 };
};

/**
 * Main query helper function
 * @param {Object} Model - Mongoose model
 * @param {Object} queryParams - Request query parameters
 * @param {Array} searchFields - Fields to search in
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - { data, pagination }
 */
export const queryHelper = async (
  Model,
  queryParams = {},
  searchFields = [],
  options = {}
) => {
  try {
    const {
      defaultFilters = {},
      populate = [],
      select = "",
      lean = false,
    } = options;

    // Extract pagination parameters
    const page = Math.max(1, parseInt(queryParams.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit) || 10)); // Max 100 items per page

    // Build search query
    const searchQuery = buildSearchQuery(queryParams.q, searchFields);

    // Build filter query
    const filterQuery = buildFilterQuery(queryParams, defaultFilters);

    // Combine search and filter queries
    const finalQuery = {
      ...filterQuery,
      ...(Object.keys(searchQuery).length > 0 && searchQuery),
    };

    // Build sort query
    const sortQuery = buildSortQuery(queryParams.sort);

    // Execute query with pagination
    let query = Model.find(finalQuery).sort(sortQuery);

    // Apply populate if specified
    if (populate && populate.length > 0) {
      populate.forEach((pop) => {
        if (typeof pop === "string") {
          query = query.populate(pop);
        } else if (typeof pop === "object") {
          query = query.populate(pop);
        }
      });
    }

    // Apply select if specified
    if (select) {
      query = query.select(select);
    }

    // Apply lean if specified
    if (lean) {
      query = query.lean();
    }

    // Get total count for pagination
    const total = await Model.countDocuments(finalQuery);

    // Apply pagination
    const skip = (page - 1) * limit;
    const data = await query.skip(skip).limit(limit);

    // Calculate pagination info
    const pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Export individual helper functions for custom use cases
 */
export { sanitizeKeyword, buildSearchQuery, buildFilterQuery, buildSortQuery };

