const { app } = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server on port http://localhost:${PORT}`);
});
