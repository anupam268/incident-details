import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import { CheckCircleOutline, WarningAmber, FilterList } from "@mui/icons-material";
import sampleData from "../data";
import { interpolateRgb } from "d3-interpolate";
import { Sparklines, SparklinesLine } from "react-sparklines";

// Function to calculate gradient based on count with enhanced color range
const getGradient = (count, maxCount) => {
  const colorScale = interpolateRgb("#FFF3E0", "#C62828"); // Light orange to dark red
  const intensity = count / maxCount;
  return colorScale(intensity);
};

// Function to determine text color based on background lightness
const getTextColor = (count, maxCount) => {
  const intensity = count / maxCount;
  return intensity > 0.5 ? "#fff" : "#212121"; // Dark text for light backgrounds, white for dark
};

const IncidentGrid = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("count-desc");
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a 1-second data fetch
  }, []);

  // Handle opening the sort/filter menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the sort/filter menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle sorting/filtering
  const handleSortChange = (order) => {
    setSortOrder(order);
    handleMenuClose();
  };

  // Sort data based on selected order
  const sortedData = [...sampleData].sort((a, b) => {
    if (sortOrder === "count-desc") {
      return b.count - a.count;
    } else if (sortOrder === "count-asc") {
      return a.count - b.count;
    } else if (sortOrder === "name-asc") {
      return a.main_application.localeCompare(b.main_application);
    } else if (sortOrder === "name-desc") {
      return b.main_application.localeCompare(a.main_application);
    } else {
      return 0;
    }
  });

  const maxCount = Math.max(...sortedData.map(app => app.count));

  return (
    <div style={{ padding: 40, background: "#f7f7f7" }}>
      <Grid container direction="column" alignItems="center" style={{ marginBottom: 40 }}>
        <Typography 
          variant="h4" 
          style={{ 
            fontWeight: "600", 
            fontSize: "1.75rem", // Slightly reduced font size
            letterSpacing: "0.05em", 
            textAlign: "center", 
            lineHeight: 1.3,
            color: "#333", // Darker shade for better contrast
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          }}
        >
          Anomalies in last 48 hours before Iceboard Incidents Creation
        </Typography>
        <div style={{
            width: "50px",
            height: "3px",
            backgroundColor: "#C62828", // Match your main color theme
            marginTop: "10px"
          }}>
        </div>
      </Grid>
      <Grid container justifyContent="space-between" alignItems="center">
        <IconButton onClick={handleMenuOpen} style={{ marginLeft: 'auto' }}>
          <FilterList />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleSortChange("count-desc")}>Sort by Count (High to Low)</MenuItem>
          <MenuItem onClick={() => handleSortChange("count-asc")}>Sort by Count (Low to High)</MenuItem>
          <MenuItem onClick={() => handleSortChange("name-asc")}>Sort by Name (A to Z)</MenuItem>
          <MenuItem onClick={() => handleSortChange("name-desc")}>Sort by Name (Z to A)</MenuItem>
        </Menu>
      </Grid>
      {loading ? (
        <Typography variant="h5" align="center">Loading data...</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {sortedData.map((app, index) => {
            const backgroundColor = getGradient(app.count, maxCount);
            const textColor = getTextColor(app.count, maxCount);

            return (
              <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                <Tooltip title={`Last Anomaly Date: ${app.lastAnomalyDate}`} arrow>
                  <Paper
                    style={{
                      padding: 20, // Reduced padding
                      backgroundColor: backgroundColor,
                      textAlign: "center",
                      borderRadius: 15, // Slightly reduced border radius
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // Reduced shadow size
                      color: textColor,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      ...(app.count > 100 && { animation: "pulse 2s infinite" }), // Pulse effect for high severity
                    }}
                    elevation={4} // Slightly reduced elevation
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0px 12px 24px rgba(0, 0, 0, 0.2)";
                      e.currentTarget.style.filter = "brightness(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.filter = "brightness(1)";
                    }}
                  >
                    <Grid container direction="column" alignItems="center">
                      <Grid item>
                        {app.count > 0 ? (
                          <WarningAmber fontSize="medium" style={{ color: textColor, marginBottom: 4 }} />
                        ) : (
                          <CheckCircleOutline fontSize="medium" style={{ color: "#4CAF50", marginBottom: 4 }} />
                        )}
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" component="div" style={{ fontWeight: 600, fontSize: "1rem" }}>
                          {app.main_application}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h3" component="div" style={{ fontWeight: "bold", fontSize: "2rem", marginTop: 5 }}>
                          {app.count}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginTop: 5 }}>
                        <Sparklines data={[app.count, app.count - 10, app.count + 5, app.count - 2]} limit={5}>
                          <SparklinesLine style={{ fill: "none" }} color={textColor} />
                        </Sparklines>
                      </Grid>
                    </Grid>
                  </Paper>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default IncidentGrid;
