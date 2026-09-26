/**
 * ============================================================================
 * GOOGLE APPS SCRIPT FOR HOMEADS (homeads.ae)
 * ============================================================================
 * SPREADSHEET: website Start Your Project Today messages
 * SPREADSHEET ID: 1RF7Ys9OHD777emTv11CFIh00n7H7HN0FQA6h_k5yMvU
 * 
 * Target Sheet Columns:
 * Column A: Your Name *
 * Column B: Phone Number *
 * Column C: Email Address
 * Column D: Service Required *
 * Column E: Tell Us About Your Project
 * Column F: Submitted At
 * 
 * QUICK 1-MINUTE SETUP INSTRUCTIONS:
 * 1. In your Google Sheet tab, click "Extensions" in the top menu bar.
 * 2. Click "Apps Script".
 * 3. Delete any template code inside the editor (like "function myFunction() {}").
 * 4. Copy and paste ALL the code below into the Apps Script editor.
 * 5. Click the blue "Save" (disk icon) button at the top.
 * 6. Click the blue "Deploy" button (top right) -> choose "New deployment".
 * 7. Next to "Select type", click the gear icon ⚙️ and select "Web app".
 * 8. Set the following options:
 *    - Description: HomeAds Website Form Grabber
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone (IMPORTANT: Choose "Anyone" so visitors can send inquiries)
 * 9. Click "Deploy". If Google asks for authorization:
 *    - Click "Authorize access"
 *    - Choose your Google account
 *    - Click "Advanced" -> Click "Go to Untitled project (unsafe)"
 *    - Click "Allow"
 * 10. Copy the generated "Web app URL" (it looks like: https://script.google.com/macros/s/AKfycb.../exec).
 * 11. Open "submit-to-sheet.js" in your website folder and paste this URL into GOOGLE_SCRIPT_URL!
 * ============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other concurrent requests before processing
  lock.tryLock(10000);

  try {
    // Open by exact Spreadsheet ID to guarantee it finds the right sheet
    var SPREADSHEET_ID = "1RF7Ys9OHD777emTv11CFIh00n7H7HN0FQA6h_k5yMvU";
    var doc = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = doc.getSheetByName("Sheet1") || doc.getActiveSheet();
    
    // Ensure header for Column F (Timestamp) exists
    if (sheet.getLastColumn() < 6 || !sheet.getRange(1, 6).getValue()) {
      sheet.getRange(1, 6).setValue("Submitted On (IST)");
      sheet.getRange(1, 6).setFontWeight("bold");
    }

    var data = {};

    // 1. Check URL parameters / FormData
    if (e && e.parameter) {
      for (var key in e.parameter) {
        data[key] = e.parameter[key];
      }
    }

    // 2. Check JSON payload if sent as JSON body
    if (e && e.postData && e.postData.contents) {
      try {
        var json = JSON.parse(e.postData.contents);
        for (var k in json) {
          data[k] = json[k];
        }
      } catch (err) {}
    }

    // Map incoming data to Sheet Column order:
    // A: Your Name *
    // B: Phone Number *
    // C: Email Address
    // D: Service Required *
    // E: Tell Us About Your Project
    // F: Timestamp
    var name = data["Your Name *"] || data["name"] || data["fullName"] || data["Name"] || "";
    var phone = data["Phone Number *"] || data["phone"] || data["Phone"] || "";
    var email = data["Email Address"] || data["email"] || data["Email"] || "";
    var service = data["Service Required *"] || data["service"] || data["Service"] || data["projectType"] || "";
    var message = data["Tell Us About Your Project"] || data["message"] || data["Message"] || data["projectScope"] || "";

    // If company name was provided (e.g. from enterprise form), append it to message
    if (data["company"]) {
      message = "[Company: " + data["company"] + "] " + message;
    }

    // Current Indian Standard Time (IST)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");

    // Append to sheet
    sheet.appendRow([name, phone, email, service, message, timestamp]);

    // Return JSON success response
    return ContentService
      .createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Form details grabbed into Google Sheet successfully!",
        "row": sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        "status": "error",
        "message": error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      "status": "online",
      "sheet": SpreadsheetApp.getActiveSpreadsheet().getName(),
      "message": "HomeAds Form Capture Web App is running."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
