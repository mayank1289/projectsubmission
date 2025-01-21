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


// for date email and name search


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

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
      const startDate = new Date(`${year}-${month}-${day}`);
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

    // Search for users with the specified criteria
    const users = await User.find(searchCriteria);

    // Return matching users
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error searching database:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}









//for pagination get logic along with other props

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const query = searchParams.get("query") || ""; // Get the search query
//     const page = parseInt(searchParams.get("page") || "1", 10); // Current page
//     const limit = parseInt(searchParams.get("limit") || "10", 10); // Items per page

//     // Determine if the query is for email or name
//     const searchCriteria = query.includes("@")
//       ? { email: query }
//       : query
//       ? { name: { $regex: query, $options: "i" } } // Case-insensitive search for names
//       : {};

//     // Connect to MongoDB
//     await connectMongoDB();

//     // Get the total count of matching documents
//     const totalCount = await User.countDocuments(searchCriteria);

//     // Fetch paginated results
//     const users = await User.find(searchCriteria)
//       .skip((page - 1) * limit) // Skip documents for previous pages
//       .limit(limit); // Limit the number of documents fetched

//     // Return users with pagination details
//     return new Response(
//       JSON.stringify({
//         users,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error searching database:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }