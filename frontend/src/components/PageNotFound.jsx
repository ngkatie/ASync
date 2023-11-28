import React from "react";
import { Box, Button, Typography } from "@mui/material";

const PageNotFound = () => {
    return (
        <>
            <Box 
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "50%",
                    margin: "auto"
                }
            }>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                404: Page Not Found
                </Typography>

                <Button href="/" variant="outlined" sx={{ fontSize: 20 }}>Return Home</Button>
            </Box>
        </>
    )
}

export default PageNotFound