# TODO: Remove Authentication and Simplify Backend

## Files to Delete
- [x] Backend/src/middleware/auth.js
- [x] Backend/src/models/users.js
- [x] Backend/src/models/bookings.js
- [x] Backend/src/controller/usercontroller.js
- [x] Backend/src/routes/userroutes.js

## Files to Edit
- [x] Backend/src/middleware/validation.js: Remove user validation schemas and functions
- [x] Backend/src/utils/constants.js: Remove JWT, PASSWORD, USER_ROLES
- [x] Backend/src/models/hotels.js: Remove createdBy field
- [x] Backend/src/controller/hotelcontroller.js: Remove req.user references
- [x] Backend/src/routes/hotelroutes.js: Remove authentication middleware
- [x] Backend/src/server.js: Remove userroutes import and mounting

## Followup
- [x] Start server and check for errors
- [ ] Verify hotel endpoints work without auth
