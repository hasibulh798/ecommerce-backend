export const testController = (req, res) => {
    res.status(200).send({
        massage: 'Test routes',
        success: true
    });
}