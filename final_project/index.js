const express = require("express");
const session = require("express-session");
const customerRoutes = require("./router/auth_users.js").authenticated;
const generalRoutes = require("./router/general.js").general;

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: "book-review-session-secret",
    resave: false,
    saveUninitialized: true
  })
);

app.use("/", generalRoutes);
app.use("/customer", customerRoutes);

app.listen(port, () => {
  console.log(`Book review server is running on port ${port}`);
});
