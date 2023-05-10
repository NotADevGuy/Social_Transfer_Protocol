const express = require("express");
const router = express.Router();

router.get("/download", (req, res) => {
    const filePath = "C:\\Users\\mattt\\WebstormProjects\\stp_backend\\src\\STP.jar";
    const fileName = "STP.jar";

    res.sendFile(filePath, {
        headers: {
            "Context-Type": "application/jar",
            "Content-Disposition": "attachment; filename=" + fileName
        }
    })
})



module.exports = router;