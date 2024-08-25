import data from "./data"; // Import the local data as a fallback

// Function to fetch data
export const fetchIncidentData = async () => {
  try {
    // Attempt to fetch from the API
    const response = await fetch("YOUR_API_ENDPOINT_HERE");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiData = await response.json();
    return apiData.incidentDetails; // Assuming API response structure matches local data structure
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return data.incidentDetails; // Fallback to local data if API call fails
  }
};
