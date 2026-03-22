import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Backend Logical Server Running');
});

app.listen(PORT, () => {
    console.log(`[Backend] API Server is running on port ${PORT}`);
});
