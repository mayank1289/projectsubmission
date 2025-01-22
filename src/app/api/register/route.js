import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const { name, email } = await req.json();
    
    await connectMongoDB();
    await User.create({ name, email });

    return NextResponse.json({ message: "credentials registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the credentials." },
      { status: 500 }
    );
  }
}



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page"), 10) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit"), 10) || 10; // Default to 10 items per page

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: 400 }
      );
    }

    let searchCriteria;

    if (query.includes("@")) {
      // Email search
      searchCriteria = { email: query };
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(query)) {
      // Date search in dd/mm/yyyy format
      const [day, month, year] = query.split("/");

      // Ensure the date is formatted correctly to yyyy-mm-dd
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const startDate = new Date(formattedDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // Add one day to include the entire day

      searchCriteria = {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    } else {
      // Name search (case-insensitive)
      searchCriteria = { name: { $regex: new RegExp(`^${query}`, "i") } };
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Search for users with the specified criteria and apply pagination
    const users = await User.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    // Get the total count of matching users for pagination metadata
    const totalUsers = await User.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalUsers / limit);

    // Return matching users along with pagination metadata
    return new Response(
      JSON.stringify({
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching database:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
